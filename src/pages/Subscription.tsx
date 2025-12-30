import React, { useState } from 'react';
import { useStore } from '../contexts/StoreContext';
import { useAuth } from '../contexts/AuthContext';
import { Check, Star, Loader2, ExternalLink, CreditCard } from 'lucide-react';

// Stripe Price IDs from environment
const STRIPE_PRICES: Record<string, string> = {
    free: import.meta.env.VITE_STRIPE_PRICE_FREE || '',
    pro: import.meta.env.VITE_STRIPE_PRICE_PRO || '',
    enterprise: import.meta.env.VITE_STRIPE_PRICE_ENTERPRISE || '',
};

export const Subscription: React.FC = () => {
    const { user, plans } = useStore();
    const { user: authUser } = useAuth();
    const currentPlan = plans.find(p => p.slug === user?.plan_id);
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const [loadingPortal, setLoadingPortal] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check URL params for success/cancel
    const urlParams = new URLSearchParams(window.location.search);
    const isSuccess = urlParams.get('success') === 'true';
    const isCanceled = urlParams.get('canceled') === 'true';

    const handleUpgrade = async (planSlug: string) => {
        const priceId = STRIPE_PRICES[planSlug];

        if (!priceId) {
            setError('Configuração de plano não encontrada. Por favor, contate o suporte.');
            return;
        }

        if (!authUser?.id || !authUser?.email) {
            setError('Você precisa estar logado para fazer upgrade.');
            return;
        }

        setLoadingPlan(planSlug);
        setError(null);

        try {
            const response = await fetch('/api/stripe/create-checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId,
                    userId: authUser.id,
                    userEmail: authUser.email,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Falha ao criar sessão de checkout');
            }

            // Redirect to Stripe Checkout
            window.location.href = data.url;
        } catch (err: any) {
            console.error('Checkout error:', err);
            setError(err.message || 'Ocorreu um erro. Tente novamente.');
        } finally {
            setLoadingPlan(null);
        }
    };

    const handleManageSubscription = async () => {
        if (!authUser?.id) {
            setError('Você precisa estar logado para gerenciar sua assinatura.');
            return;
        }

        setLoadingPortal(true);
        setError(null);

        try {
            const response = await fetch('/api/stripe/portal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: authUser.id,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Falha ao abrir portal');
            }

            // Redirect to Stripe Customer Portal
            window.location.href = data.url;
        } catch (err: any) {
            console.error('Portal error:', err);
            setError(err.message || 'Ocorreu um erro. Tente novamente.');
        } finally {
            setLoadingPortal(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-text-primary">Planos e Assinatura</h2>
                <p className="text-text-secondary">Escolha o plano ideal para suas necessidades</p>
            </div>

            {/* Success Message */}
            {isSuccess && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                    <p className="text-green-400 font-medium">
                        🎉 Parabéns! Seu upgrade foi realizado com sucesso!
                    </p>
                </div>
            )}

            {/* Canceled Message */}
            {isCanceled && (
                <div className="bg-warning-500/10 border border-warning-500/30 rounded-xl p-4 text-center">
                    <p className="text-warning-400">
                        Checkout cancelado. Você pode tentar novamente quando quiser.
                    </p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-error-500/10 border border-error-500/30 rounded-xl p-4 text-center">
                    <p className="text-error-400">{error}</p>
                </div>
            )}

            {/* Current Plan Banner */}
            <div className="bg-gradient-to-r from-primary-900/50 to-primary-600/30 border border-primary-500/30 rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded">ATUAL</span>
                        <h3 className="text-2xl font-bold text-text-primary capitalize">{currentPlan?.name}</h3>
                    </div>
                    <p className="text-text-secondary max-w-lg">
                        Você tem acesso a {currentPlan?.max_prompts === -1 ? 'prompts ilimitados' : `${currentPlan?.max_prompts} prompts`} e {currentPlan?.max_workspaces} workspaces.
                    </p>
                </div>
                <div className="text-left md:text-right">
                    {user?.plan_id !== 'free' && (
                        <>
                            <p className="text-sm text-text-secondary mb-1">Próxima renovação</p>
                            <p className="font-medium text-text-primary">23 Dez, 2025</p>
                        </>
                    )}
                    <button
                        onClick={handleManageSubscription}
                        disabled={loadingPortal}
                        className="mt-4 text-primary-400 hover:text-primary-300 text-sm font-medium underline flex items-center gap-1"
                    >
                        {loadingPortal ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <CreditCard className="w-4 h-4" />
                        )}
                        Gerenciar Assinatura
                    </button>
                </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                {plans.map(plan => {
                    const isCurrent = user?.plan_id === plan.slug;
                    const isPopular = plan.slug === 'pro';
                    const isLoading = loadingPlan === plan.slug;
                    const isFree = plan.price_monthly === 0;

                    return (
                        <div
                            key={plan.id}
                            className={`relative bg-bg-surface border rounded-xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${isCurrent
                                ? 'border-primary-500 shadow-glow'
                                : 'border-border-subtle hover:border-primary-500/50'
                                }`}
                        >
                            {isPopular && (
                                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                                    <span className="bg-accent-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-current" /> POPULAR
                                    </span>
                                </div>
                            )}

                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-text-primary">{plan.name}</h3>
                                <p className="text-sm text-text-secondary h-10 mt-2">{plan.description}</p>
                            </div>

                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-3xl font-bold text-text-primary">
                                    {isFree ? 'Grátis' : `R$ ${plan.price_monthly}`}
                                </span>
                                {!isFree && <span className="text-text-muted">/mês</span>}
                            </div>

                            <div className="space-y-3 mb-8 flex-1">
                                {plan.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-3 text-sm text-text-secondary">
                                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => !isCurrent && !isFree && handleUpgrade(plan.slug)}
                                disabled={isCurrent || isLoading || isFree}
                                className={`w-full py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${isCurrent
                                    ? 'bg-bg-elevated text-text-muted cursor-default'
                                    : isFree
                                        ? 'bg-bg-elevated text-text-muted cursor-default'
                                        : 'btn-primary shadow-lg hover:shadow-primary-500/25'
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Processando...
                                    </>
                                ) : isCurrent ? (
                                    'Plano Atual'
                                ) : isFree ? (
                                    'Plano Gratuito'
                                ) : (
                                    <>
                                        Fazer Upgrade
                                        <ExternalLink className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Stripe info */}
            <p className="text-center text-text-muted text-sm">
                Pagamentos processados com segurança pelo Stripe. Cancele a qualquer momento.
            </p>
        </div>
    );
};
