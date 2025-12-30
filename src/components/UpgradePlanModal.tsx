import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from './ui/Modal';
import { Zap, X, Check, ArrowRight } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';

interface UpgradePlanModalProps {
    onClose: () => void;
    limitType: 'prompts' | 'workspaces' | 'variables' | 'export';
    currentUsage?: number;
    currentLimit?: number;
}

const LIMIT_MESSAGES = {
    prompts: {
        title: 'Limite de Prompts Atingido',
        description: 'Você atingiu o limite de prompts do seu plano atual.',
    },
    workspaces: {
        title: 'Limite de Workspaces Atingido',
        description: 'Você atingiu o limite de workspaces do seu plano atual.',
    },
    variables: {
        title: 'Limite de Variáveis Atingido',
        description: 'Você atingiu o limite de variáveis customizadas do seu plano atual.',
    },
    export: {
        title: 'Exportação não disponível',
        description: 'A exportação de prompts não está disponível no plano gratuito.',
    },
};

const PLAN_FEATURES = [
    { name: 'Até 500 prompts', free: false, pro: true },
    { name: 'Até 10 workspaces', free: false, pro: true },
    { name: 'Até 100 variáveis', free: false, pro: true },
    { name: 'Exportação CSV/JSON', free: false, pro: true },
    { name: 'Suporte prioritário', free: false, pro: true },
];

export const UpgradePlanModal: React.FC<UpgradePlanModalProps> = ({
    onClose,
    limitType,
    currentUsage,
    currentLimit,
}) => {
    const navigate = useNavigate();
    const { user } = useStore();
    const message = LIMIT_MESSAGES[limitType];

    const handleUpgrade = () => {
        onClose();
        navigate('/subscription');
    };

    return (
        <Modal onClose={onClose} size="md">
            <div className="p-6 text-center">
                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                    {message.title}
                </h2>

                {/* Description */}
                <p className="text-text-secondary mb-2">
                    {message.description}
                </p>

                {/* Usage indicator */}
                {currentUsage !== undefined && currentLimit !== undefined && (
                    <div className="mb-6">
                        <div className="flex justify-center items-center gap-2 text-sm text-text-muted">
                            <span className="font-medium text-error-400">{currentUsage}</span>
                            <span>/</span>
                            <span>{currentLimit}</span>
                            <span>utilizados</span>
                        </div>
                        <div className="mt-2 w-48 mx-auto h-2 bg-bg-elevated rounded-full overflow-hidden">
                            <div
                                className="h-full bg-error-500 rounded-full"
                                style={{ width: '100%' }}
                            />
                        </div>
                    </div>
                )}

                {/* Current Plan */}
                <div className="bg-bg-elevated rounded-xl p-4 mb-6">
                    <p className="text-sm text-text-muted mb-1">Seu plano atual</p>
                    <p className="text-lg font-semibold text-text-primary capitalize">
                        {user?.plan_id || 'Free'}
                    </p>
                </div>

                {/* Features comparison */}
                <div className="text-left mb-6">
                    <p className="text-sm font-medium text-text-primary mb-3">
                        Faça upgrade para Pro e tenha:
                    </p>
                    <div className="space-y-2">
                        {PLAN_FEATURES.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                                <Check className="w-4 h-4 text-green-500" />
                                <span className="text-text-secondary">{feature.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-border-default text-text-secondary hover:bg-bg-hover transition-colors"
                    >
                        Depois
                    </button>
                    <button
                        onClick={handleUpgrade}
                        className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                        Ver Planos
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </Modal>
    );
};
