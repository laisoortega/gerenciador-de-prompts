import React, { useState } from 'react';
import { useStore } from '../contexts/StoreContext';

export const Login: React.FC = () => {
    const { login, isLoading } = useStore();
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) login(email);
    };

    return (
        <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-4">
            <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-2xl shadow-[#3b82f633] mx-auto mb-4">
                    P
                </div>
                <h1 className="text-3xl font-bold text-text-primary">PromptMaster</h1>
                <p className="text-text-secondary mt-2">Gerencie seus prompts como um profissional.</p>
            </div>

            <div className="w-full max-w-md bg-bg-surface border border-border-default rounded-2xl p-8 shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">E-mail de acesso</label>
                        <input
                            type="email"
                            required
                            placeholder="seu@email.com"
                            className="input-primary w-full"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn-primary w-full py-3 flex items-center justify-center"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Entrando...' : 'Entrar na Plataforma'}
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-text-muted">
                    <p>Ao continuar, você concorda com nossos Termos de Uso.</p>
                    <p className="mt-2 text-[#3b82f680]">Dica: Use 'admin@teste.com' para acesso total.</p>
                </div>
            </div>
        </div>
    );
};
