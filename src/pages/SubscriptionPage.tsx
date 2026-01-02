import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Crown, Infinity, ChevronLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useStore } from '../contexts/StoreContext';

const plans = [
    {
        id: 'free',
        name: 'Free',
        price: 'Grátis',
        description: 'Para começar a testar',
        features: [
            '50 prompts',
            '5 variáveis',
            '3 compartilhamentos/mês',
            'Busca básica',
        ],
        current: true,
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 'R$ 19,90',
        period: '/mês',
        description: 'Para uso profissional',
        features: [
            'Prompts ilimitados',
            'Variáveis ilimitadas',
            'Compartilhamentos ilimitados',
            'Busca avançada com IA',
            'Modelos prontos',
            'Suporte prioritário',
        ],
        recommended: true,
    },
    {
        id: 'team',
        name: 'Team',
        price: 'R$ 49,90',
        period: '/mês',
        description: 'Para equipes',
        features: [
            'Tudo do Pro',
            'Até 5 membros',
            'Workspace compartilhado',
            'Controle de permissões',
            'Analytics de uso',
            'API access',
        ],
    },
];

export function SubscriptionPage() {
    const navigate = useNavigate();
    const { prompts } = useStore();

    return (
        <div className="min-h-screen bg-bg-base">
            {/* Header */}
            <div className="border-b border-border-subtle bg-bg-surface">
                <div className="max-w-5xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-bg-hover rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-text-muted" />
                        </button>
                        <div>
                            <h1 className="text-xl font-semibold text-text-primary">Planos e Assinatura</h1>
                            <p className="text-sm text-text-muted">Escolha o plano ideal para você</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* Current Usage */}
                <div className="mb-12 p-6 bg-bg-surface rounded-xl border border-border-subtle">
                    <h2 className="text-lg font-semibold text-text-primary mb-4">Seu Uso Atual</h2>
                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <p className="text-text-muted text-sm">Prompts</p>
                            <p className="text-2xl font-bold text-text-primary">{prompts.length} <span className="text-sm font-normal text-text-muted">/ 50</span></p>
                            <div className="mt-2 h-2 bg-bg-elevated rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary-500 rounded-full transition-all"
                                    style={{ width: `${Math.min((prompts.length / 50) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <p className="text-text-muted text-sm">Variáveis</p>
                            <p className="text-2xl font-bold text-text-primary">3 <span className="text-sm font-normal text-text-muted">/ 5</span></p>
                            <div className="mt-2 h-2 bg-bg-elevated rounded-full overflow-hidden">
                                <div className="h-full bg-primary-500 rounded-full w-[60%]" />
                            </div>
                        </div>
                        <div>
                            <p className="text-text-muted text-sm">Compartilhamentos</p>
                            <p className="text-2xl font-bold text-text-primary">1 <span className="text-sm font-normal text-text-muted">/ 3</span></p>
                            <div className="mt-2 h-2 bg-bg-elevated rounded-full overflow-hidden">
                                <div className="h-full bg-primary-500 rounded-full w-[33%]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative p-6 rounded-2xl border-2 transition-all ${plan.recommended
                                    ? 'border-primary-500 bg-bg-surface shadow-lg shadow-primary-500/10'
                                    : plan.current
                                        ? 'border-primary-500/50 bg-bg-surface'
                                        : 'border-border-subtle bg-bg-surface hover:border-border-default'
                                }`}
                        >
                            {/* Recommended Badge */}
                            {plan.recommended && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
                                        Recomendado
                                    </span>
                                </div>
                            )}

                            {/* Current Badge */}
                            {plan.current && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="px-3 py-1 bg-bg-elevated text-text-secondary text-xs font-medium rounded-full border border-border-default">
                                        Plano Atual
                                    </span>
                                </div>
                            )}

                            {/* Plan Icon */}
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${plan.id === 'free' ? 'bg-gray-500/10 text-gray-500' :
                                    plan.id === 'pro' ? 'bg-primary-500/10 text-primary-500' :
                                        'bg-purple-500/10 text-purple-500'
                                }`}>
                                {plan.id === 'free' && <Zap className="w-6 h-6" />}
                                {plan.id === 'pro' && <Crown className="w-6 h-6" />}
                                {plan.id === 'team' && <Infinity className="w-6 h-6" />}
                            </div>

                            {/* Plan Details */}
                            <h3 className="text-xl font-bold text-text-primary">{plan.name}</h3>
                            <p className="text-text-muted text-sm mt-1">{plan.description}</p>

                            <div className="mt-4 mb-6">
                                <span className="text-3xl font-bold text-text-primary">{plan.price}</span>
                                {plan.period && <span className="text-text-muted">{plan.period}</span>}
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-2">
                                        <Check className="w-5 h-5 text-success-500 flex-shrink-0" />
                                        <span className="text-sm text-text-secondary">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            <Button
                                className="w-full"
                                variant={plan.current ? 'outline' : plan.recommended ? 'primary' : 'outline'}
                                disabled={plan.current}
                            >
                                {plan.current ? 'Plano Atual' : plan.id === 'free' ? 'Downgrade' : 'Fazer Upgrade'}
                            </Button>
                        </div>
                    ))}
                </div>

                {/* FAQ or Additional Info */}
                <div className="mt-12 text-center">
                    <p className="text-text-muted">
                        Dúvidas? Entre em contato com nosso suporte: <a href="mailto:suporte@blaze.app" className="text-primary-500 hover:underline">suporte@blaze.app</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SubscriptionPage;
