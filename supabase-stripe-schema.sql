-- ===========================================
-- SCHEMA: STRIPE INTEGRATION
-- Execute este SQL no Supabase SQL Editor
-- ===========================================

-- Adicionar campo stripe_customer_id ao user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Adicionar índice para busca rápida
CREATE INDEX IF NOT EXISTS idx_user_profiles_stripe_customer 
ON public.user_profiles(stripe_customer_id);

-- Adicionar campo stripe_subscription_id às subscriptions
ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Adicionar status à subscription se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'subscriptions' AND column_name = 'status') THEN
        ALTER TABLE public.subscriptions ADD COLUMN status TEXT DEFAULT 'active';
    END IF;
END $$;

-- Adicionar campos de período às subscriptions
ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS current_period_start TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ;

-- ===========================================
-- PRONTO! Execute e o Stripe estará preparado
-- ===========================================
