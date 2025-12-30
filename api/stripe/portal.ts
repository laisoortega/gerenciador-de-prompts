import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createCustomerPortalSession, stripe } from '../lib/stripe';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'Missing userId' });
        }

        // Get user's Stripe customer ID
        const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('stripe_customer_id, email')
            .eq('id', userId)
            .single();

        if (profileError || !profile) {
            return res.status(404).json({ error: 'User not found' });
        }

        let customerId = profile.stripe_customer_id;

        // If no customer ID, create a new Stripe customer
        if (!customerId) {
            // Get email from auth.users
            const { data: authUser } = await supabase.auth.admin.getUserById(userId);

            if (!authUser?.user?.email) {
                return res.status(400).json({ error: 'User email not found' });
            }

            const customer = await stripe.customers.create({
                email: authUser.user.email,
                metadata: { userId },
            });

            customerId = customer.id;

            // Save customer ID
            await supabase
                .from('user_profiles')
                .update({ stripe_customer_id: customerId })
                .eq('id', userId);
        }

        const url = await createCustomerPortalSession(customerId);

        return res.status(200).json({ url });
    } catch (error: any) {
        console.error('Portal error:', error);
        return res.status(500).json({
            error: error.message || 'Failed to create portal session'
        });
    }
}
