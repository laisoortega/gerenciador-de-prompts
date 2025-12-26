import React from 'react';
import { useStore } from '../contexts/StoreContext';
import { Check, Star } from 'lucide-react';

export const Subscription: React.FC = () => {
    const { user, plans } = useStore();
    const currentPlan = plans.find(p => p.slug === user?.plan_id);

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-text-primary">Planos e Assinatura</h2>
                <p className="text-text-secondary">Escolha o plano ideal para suas necessidades</p>
            </div>

            {/* Current Plan Banner */}
            <div className="bg-gradient-to-r from-primary-900/50 to-primary-600/30 border border-primary-500/30 rounded-2xl p-8 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded">ATUAL</span>
                        <h3 className="text-2xl font-bold text-text-primary capitalize">{currentPlan?.name}</h3>
                    </div>
                    <p className="text-text-secondary max-w-lg">
                        Você tem acesso a {currentPlan?.max_prompts === -1 ? 'prompts ilimitados' : `${currentPlan?.max_prompts} prompts`} e {currentPlan?.max_workspaces} workspaces.
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-text-secondary mb-1">Próxima renovação</p>
                    <p className="font-medium text-text-primary">23 Dez, 2025</p>
                    <button className="mt-4 text-primary-400 hover:text-primary-300 text-sm font-medium underline">
                        Gerenciar Assinatura
                    </button>
                </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                {plans.map(plan => {
                    const isCurrent = user?.plan_id === plan.slug;
                    const isPopular = plan.slug === 'pro';

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
                                    R$ {plan.price_monthly}
                                </span>
                                <span className="text-text-muted">/mês</span>
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
                                disabled={isCurrent}
                                className={`w-full py-2.5 rounded-lg font-medium transition-all ${isCurrent
                                    ? 'bg-bg-elevated text-text-muted cursor-default'
                                    : 'btn-primary shadow-lg hover:shadow-primary-500/25'
                                    }`}
                            >
                                {isCurrent ? 'Plano Atual' : 'Fazer Upgrade'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
