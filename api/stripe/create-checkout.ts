import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createCheckoutSession } from '../lib/stripe';

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
        const { priceId, userId, userEmail } = req.body;

        if (!priceId || !userId || !userEmail) {
            return res.status(400).json({
                error: 'Missing required fields: priceId, userId, userEmail'
            });
        }

        const result = await createCheckoutSession({
            priceId,
            userId,
            userEmail,
        });

        return res.status(200).json(result);
    } catch (error: any) {
        console.error('Checkout error:', error);
        return res.status(500).json({
            error: error.message || 'Failed to create checkout session'
        });
    }
}
