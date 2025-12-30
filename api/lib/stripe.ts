import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
});

export interface CreateCheckoutRequest {
    priceId: string;
    userId: string;
    userEmail: string;
    successUrl?: string;
    cancelUrl?: string;
}

export interface CreateCheckoutResponse {
    url: string;
    sessionId: string;
}

export async function createCheckoutSession(
    req: CreateCheckoutRequest
): Promise<CreateCheckoutResponse> {
    const { priceId, userId, userEmail, successUrl, cancelUrl } = req;

    const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        customer_email: userEmail,
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        metadata: {
            userId,
        },
        success_url: successUrl || `${process.env.VITE_APP_URL || 'http://localhost:5173'}/subscription?success=true`,
        cancel_url: cancelUrl || `${process.env.VITE_APP_URL || 'http://localhost:5173'}/subscription?canceled=true`,
    });

    return {
        url: session.url!,
        sessionId: session.id,
    };
}

export async function createCustomerPortalSession(customerId: string): Promise<string> {
    const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/subscription`,
    });

    return session.url;
}

export { stripe };
