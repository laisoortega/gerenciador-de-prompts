import type { VercelRequest, VercelResponse } from '@vercel/node';
import { stripe } from '../lib/stripe';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role for admin operations
);

// Stripe webhook secret for verifying signatures
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const config = {
    api: {
        bodyParser: false, // Required for Stripe webhook signature verification
    },
};

async function getRawBody(req: VercelRequest): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        req.on('data', (chunk: Buffer) => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
    });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const sig = req.headers['stripe-signature'] as string;

    if (!sig) {
        return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    let event: Stripe.Event;

    try {
        const rawBody = await getRawBody(req);
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    console.log(`Received event: ${event.type}`);

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                await handleCheckoutCompleted(session);
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionUpdated(subscription);
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionDeleted(subscription);
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice;
                await handlePaymentFailed(invoice);
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return res.status(200).json({ received: true });
    } catch (error: any) {
        console.error('Error processing webhook:', error);
        return res.status(500).json({ error: error.message });
    }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId;
    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;

    if (!userId) {
        console.error('No userId in session metadata');
        return;
    }

    // Get subscription details to find the plan
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const priceId = subscription.items.data[0]?.price.id;

    // Map price ID to plan slug
    const planSlug = getPlanSlugFromPriceId(priceId);

    // Update user profile with Stripe customer ID and new plan
    const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
            stripe_customer_id: customerId,
            plan_id: planSlug,
        })
        .eq('id', userId);

    if (profileError) {
        console.error('Error updating user profile:', profileError);
        throw profileError;
    }

    // Create or update subscription record
    const { error: subError } = await supabase
        .from('subscriptions')
        .upsert({
            user_id: userId,
            plan_id: planSlug,
            stripe_subscription_id: subscriptionId,
            status: 'active',
            current_period_start: subscription.current_period_start
                ? new Date(subscription.current_period_start * 1000).toISOString()
                : new Date().toISOString(),
            current_period_end: subscription.current_period_end
                ? new Date(subscription.current_period_end * 1000).toISOString()
                : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        }, {
            onConflict: 'user_id',
        });

    if (subError) {
        console.error('Error updating subscription:', subError);
        throw subError;
    }

    console.log(`Successfully activated ${planSlug} for user ${userId}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;
    const priceId = subscription.items.data[0]?.price.id;
    const planSlug = getPlanSlugFromPriceId(priceId);

    // Find user by Stripe customer ID
    const { data: profile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single();

    if (!profile) {
        console.error('No user found for customer:', customerId);
        return;
    }

    // Update plan
    await supabase
        .from('user_profiles')
        .update({ plan_id: planSlug })
        .eq('id', profile.id);

    await supabase
        .from('subscriptions')
        .update({
            plan_id: planSlug,
            status: subscription.status,
            current_period_end: subscription.current_period_end
                ? new Date(subscription.current_period_end * 1000).toISOString()
                : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq('user_id', profile.id);

    console.log(`Subscription updated for user ${profile.id}: ${planSlug}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;

    // Find user by Stripe customer ID
    const { data: profile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single();

    if (!profile) {
        console.error('No user found for customer:', customerId);
        return;
    }

    // Downgrade to free plan
    await supabase
        .from('user_profiles')
        .update({ plan_id: 'free' })
        .eq('id', profile.id);

    await supabase
        .from('subscriptions')
        .update({
            plan_id: 'free',
            status: 'canceled',
        })
        .eq('user_id', profile.id);

    console.log(`Subscription canceled for user ${profile.id}, downgraded to free`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
    const customerId = invoice.customer as string;

    // Find user by Stripe customer ID
    const { data: profile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single();

    if (!profile) {
        console.error('No user found for customer:', customerId);
        return;
    }

    // Create notification for user
    await supabase
        .from('notifications')
        .insert({
            user_id: profile.id,
            type: 'warning',
            title: 'Falha no pagamento',
            description: 'Houve um problema com seu pagamento. Por favor, atualize suas informações de pagamento.',
        });

    console.log(`Payment failed notification sent to user ${profile.id}`);
}

function getPlanSlugFromPriceId(priceId: string): string {
    // Map environment variable price IDs to plan slugs
    const priceMap: Record<string, string> = {
        [process.env.STRIPE_PRICE_FREE || '']: 'free',
        [process.env.STRIPE_PRICE_PRO || '']: 'pro',
        [process.env.STRIPE_PRICE_ENTERPRISE || '']: 'enterprise',
    };

    return priceMap[priceId] || 'free';
}
