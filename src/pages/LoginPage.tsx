import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, Loader2, ArrowLeft } from 'lucide-react';
import { BlazeLogo } from '../components/ui/BlazeLogo';

export function LoginPage() {
    const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signIn, signUp, resetPassword } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            if (mode === 'forgot') {
                const { error } = await resetPassword(email);
                if (error) {
                    setError(error.message);
                } else {
                    setSuccess('Email de recuperação enviado! Verifique sua caixa de entrada.');
                }
            } else if (mode === 'signup') {
                const { error } = await signUp(email, password, name);
                if (error) {
                    setError(error.message);
                } else {
                    setSuccess('Verifique seu email para confirmar a conta!');
                }
            } else {
                const { error } = await signIn(email, password);
                if (error) {
                    setError(error.message);
                } else {
                    navigate('/');
                }
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const getTitle = () => {
        switch (mode) {
            case 'signup': return 'Criar Conta';
            case 'forgot': return 'Recuperar Senha';
            default: return 'Entrar';
        }
    };

    const getButtonText = () => {
        switch (mode) {
            case 'signup': return 'Criar Conta';
            case 'forgot': return 'Enviar Email';
            default: return 'Entrar';
        }
    };

    return (
        <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                            <BlazeLogo size={28} />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-text-primary">Blaze</h1>
                    <p className="text-text-muted mt-1">Gerencie seus prompts de IA</p>
                </div>

                {/* Form Card */}
                <div className="bg-bg-surface border border-border-subtle rounded-2xl p-8 shadow-xl">
                    {mode === 'forgot' && (
                        <button
                            onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                            className="flex items-center gap-1 text-sm text-text-muted hover:text-primary-500 mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" /> Voltar ao login
                        </button>
                    )}

                    <h2 className="text-xl font-semibold text-text-primary mb-6 text-center">
                        {getTitle()}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'signup' && (
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                                    Nome
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-bg-elevated border border-border-default rounded-xl text-text-primary placeholder-text-muted focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
                                        placeholder="Seu nome"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-bg-elevated border border-border-default rounded-xl text-text-primary placeholder-text-muted focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
                                    placeholder="seu@email.com"
                                    required
                                />
                            </div>
                        </div>

                        {mode !== 'forgot' && (
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                                    Senha
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
                        )}

                        {error && (
                            <div className="p-3 rounded-lg text-sm bg-error-500/10 text-error-500">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-3 rounded-lg text-sm bg-success-500/10 text-success-500">
                                {success}
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
                                getButtonText()
                            )}
                        </button>
                    </form>

                    <div className="mt-6 flex flex-col items-center gap-2">
                        {mode === 'login' && (
                            <button
                                onClick={() => { setMode('forgot'); setError(''); setSuccess(''); }}
                                className="text-sm text-text-muted hover:text-primary-500 transition-colors"
                            >
                                Esqueci minha senha
                            </button>
                        )}

                        {mode !== 'forgot' && (
                            <button
                                onClick={() => {
                                    setMode(mode === 'login' ? 'signup' : 'login');
                                    setError('');
                                    setSuccess('');
                                }}
                                className="text-sm text-text-muted hover:text-primary-500 transition-colors"
                            >
                                {mode === 'login' ? 'Não tem conta? Criar' : 'Já tem conta? Entrar'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
