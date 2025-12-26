import React from 'react';
import { useStore } from '../contexts/StoreContext';

export const Onboarding: React.FC = () => {
    const { completeOnboarding } = useStore();

    return (
        <div className="min-h-screen bg-bg-base flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-text-primary mb-4">Bem-vindo ao PromptMaster!</h1>
                <p className="text-text-secondary mb-8">Vamos configurar sua conta rapidinho.</p>
                <button
                    onClick={() => completeOnboarding({})}
                    className="btn-primary"
                >
                    Começar
                </button>
            </div>
        </div>
    );
};
