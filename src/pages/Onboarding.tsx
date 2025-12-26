import React, { useState } from 'react';
import { useStore } from '../contexts/StoreContext';
import { ChevronRight, Check, Briefcase, Code, PenTool, Youtube, Sparkles } from 'lucide-react';

export const Onboarding: React.FC = () => {
    const { completeOnboarding, user, addWorkspace } = useStore();
    const [step, setStep] = useState(1);
    const [role, setRole] = useState('');
    const [workspaceName, setWorkspaceName] = useState('Meu Workspace');

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            handleFinish();
        }
    };

    const handleFinish = () => {
        // Create the custom workspace if changed
        if (workspaceName && workspaceName !== 'Meu Workspace') {
            addWorkspace({ name: workspaceName, icon: '⚡' });
        }

        // Complete onboarding with selected role (mocking saving role to user profile)
        completeOnboarding({
            // @ts-ignore - Assuming we might have a role field or just ignoring for mock
            role_description: role
        });
    };

    const roles = [
        { id: 'marketing', label: 'Marketing', icon: <Briefcase /> },
        { id: 'dev', label: 'Desenvolvimento', icon: <Code /> },
        { id: 'copy', label: 'Copywriting', icon: <PenTool /> },
        { id: 'creator', label: 'Criador de Conteúdo', icon: <Youtube /> },
        { id: 'other', label: 'Outro', icon: <Sparkles /> },
    ];

    return (
        <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-bg-surface border border-border-subtle rounded-2xl shadow-xl overflow-hidden">
                {/* Progress Bar */}
                <div className="h-1 bg-bg-elevated">
                    <div
                        className="h-full bg-primary-500 transition-all duration-300"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                <div className="p-8">
                    {/* Step 1: Welcome */}
                    {step === 1 && (
                        <div className="text-center animate-fadeIn">
                            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                                👋
                            </div>
                            <h1 className="text-2xl font-bold text-text-primary mb-2">
                                Olá, {user?.name?.split(' ')[0]}!
                            </h1>
                            <p className="text-text-secondary mb-8">
                                Bem-vindo ao PromptMaster. Vamos personalizar sua experiência em menos de 1 minuto.
                            </p>
                            <button onClick={handleNext} className="btn-primary w-full justify-center">
                                Começar <ChevronRight className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    )}

                    {/* Step 2: Role Selection */}
                    {step === 2 && (
                        <div className="animate-fadeIn">
                            <h2 className="text-xl font-bold text-text-primary mb-2">
                                Qual seu principal objetivo?
                            </h2>
                            <p className="text-text-secondary mb-6 text-sm">
                                Isso nos ajuda a sugerir templates relevantes.
                            </p>

                            <div className="space-y-3 mb-8">
                                {roles.map((r) => (
                                    <button
                                        key={r.id}
                                        onClick={() => setRole(r.id)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl border connection-all text-left transition-all ${role === r.id
                                                ? 'border-primary-500 bg-primary-500/10 text-primary-500'
                                                : 'border-border-default hover:border-border-hover text-text-primary hover:bg-bg-elevated'
                                            }`}
                                    >
                                        <span className={role === r.id ? 'text-primary-500' : 'text-text-muted'}>
                                            {r.icon}
                                        </span>
                                        <span className="font-medium flex-1">{r.label}</span>
                                        {role === r.id && <Check className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={!role}
                                className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continuar
                            </button>
                        </div>
                    )}

                    {/* Step 3: Workspace Setup */}
                    {step === 3 && (
                        <div className="animate-fadeIn">
                            <h2 className="text-xl font-bold text-text-primary mb-2">
                                Configure seu Espaço
                            </h2>
                            <p className="text-text-secondary mb-6 text-sm">
                                Dê um nome para onde você organizará seus prompts.
                            </p>

                            <div className="mb-8">
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    Nome do Workspace
                                </label>
                                <input
                                    type="text"
                                    value={workspaceName}
                                    onChange={(e) => setWorkspaceName(e.target.value)}
                                    className="w-full bg-bg-elevated border border-border-default rounded-lg px-4 py-3 text-text-primary focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                                    placeholder="Ex: Marketing da Empresa, Projetos Pessoais..."
                                />
                            </div>

                            <button onClick={handleFinish} className="btn-primary w-full justify-center">
                                Tudo Pronto! <Sparkles className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
