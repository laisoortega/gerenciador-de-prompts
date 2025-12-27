import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Loader2, Sparkles, CheckCircle } from 'lucide-react';

export function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { clearRecoveryMode } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        setIsLoading(true);

        try {
            if (!supabase) {
                setError('Supabase não configurado');
                return;
            }

            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) {
                setError(error.message);
            } else {
                setSuccess(true);
                clearRecoveryMode(); // Clear recovery mode so app redirects to dashboard
                setTimeout(() => navigate('/'), 2000);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
                <div className="w-full max-w-md text-center">
                    <div className="bg-bg-surface border border-border-subtle rounded-2xl p-8 shadow-xl">
                        <div className="w-16 h-16 bg-success-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-success-500" />
                        </div>
                        <h2 className="text-xl font-semibold text-text-primary mb-2">Senha Alterada!</h2>
                        <p className="text-text-muted">Redirecionando para o app...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-text-primary">PromptMaster</h1>
                    <p className="text-text-muted mt-1">Nova Senha</p>
                </div>

                {/* Form Card */}
                <div className="bg-bg-surface border border-border-subtle rounded-2xl p-8 shadow-xl">
                    <h2 className="text-xl font-semibold text-text-primary mb-6 text-center">
                        Definir Nova Senha
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">
                                Nova Senha
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-bg-elevated border border-border-default rounded-xl text-text-primary placeholder-text-muted focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">
                                Confirmar Senha
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-bg-elevated border border-border-default rounded-xl text-text-primary placeholder-text-muted focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg text-sm bg-error-500/10 text-error-500">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-primary-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                'Salvar Nova Senha'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
