import React, { useState, useEffect } from 'react';
import { Bell, UserPlus, Gift, Check, Info, Loader2, RefreshCw, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Notification {
    id: string;
    user_id: string;
    type: 'share' | 'system' | 'subscription' | 'info' | 'success' | 'warning';
    title: string;
    description: string | null;
    link: string | null;
    metadata: Record<string, any>;
    read: boolean;
    created_at: string;
}

export const Notifications: React.FC = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        loadNotifications();
    }, [user]);

    const loadNotifications = async () => {
        if (!supabase || !user) {
            // Mock data
            setNotifications([
                { id: '1', user_id: 'mock', type: 'share', title: 'Ana Silva compartilhou um prompt', description: 'Prompt: Gerador de Email de Vendas', link: null, metadata: {}, read: false, created_at: new Date(Date.now() - 1200000).toISOString() },
                { id: '2', user_id: 'mock', type: 'system', title: 'Nova funcionalidade: Análise de Vídeo', description: 'Agora você pode analisar vídeos do YouTube!', link: null, metadata: {}, read: false, created_at: new Date(Date.now() - 3600000).toISOString() },
                { id: '3', user_id: 'mock', type: 'subscription', title: 'Seu período de teste acaba em 3 dias', description: 'Faça upgrade para não perder acesso.', link: '/subscription', metadata: {}, read: true, created_at: new Date(Date.now() - 7200000).toISOString() },
                { id: '4', user_id: 'mock', type: 'info', title: 'Bem-vindo ao PromptMaster! 🎉', description: 'Complete seu perfil para aproveitar ao máximo.', link: '/settings', metadata: {}, read: true, created_at: new Date(Date.now() - 86400000).toISOString() },
            ]);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;
            setNotifications(data || []);
        } catch (err) {
            console.error('Failed to load notifications:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        if (!supabase) {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            return;
        }

        setActionLoading(id);
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ read: true })
                .eq('id', id);

            if (error) throw error;
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (err) {
            console.error('Failed to mark as read:', err);
        } finally {
            setActionLoading(null);
        }
    };

    const markAllAsRead = async () => {
        if (!supabase || !user) {
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            return;
        }

        setActionLoading('all');
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ read: true })
                .eq('user_id', user.id)
                .eq('read', false);

            if (error) throw error;
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        } finally {
            setActionLoading(null);
        }
    };

    const deleteNotification = async (id: string) => {
        if (!supabase) {
            setNotifications(prev => prev.filter(n => n.id !== id));
            return;
        }

        setActionLoading(id);
        try {
            const { error } = await supabase
                .from('notifications')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (err) {
            console.error('Failed to delete notification:', err);
        } finally {
            setActionLoading(null);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'share': return <UserPlus className="w-5 h-5 text-blue-500" />;
            case 'system': return <Gift className="w-5 h-5 text-purple-500" />;
            case 'subscription': return <AlertCircle className="w-5 h-5 text-accent-500" />;
            case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'warning': return <AlertCircle className="w-5 h-5 text-orange-500" />;
            case 'info':
            default: return <Info className="w-5 h-5 text-primary-500" />;
        }
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Agora mesmo';
        if (diffMins < 60) return `${diffMins} min atrás`;
        if (diffHours < 24) return `${diffHours}h atrás`;
        if (diffDays < 7) return `${diffDays} dia${diffDays > 1 ? 's' : ''} atrás`;
        return date.toLocaleDateString('pt-BR');
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    if (isLoading) {
        return (
            <div className="max-w-3xl mx-auto flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                    <p className="text-text-muted">Carregando notificações...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                        <Bell className="w-6 h-6" />
                        Notificações
                        {unreadCount > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-primary-500 text-white text-xs font-bold rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </h2>
                    <p className="text-text-muted text-sm mt-1">
                        {notifications.length} notificação{notifications.length !== 1 ? 'ões' : ''}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={loadNotifications}
                        className="p-2 text-text-muted hover:text-text-primary hover:bg-bg-elevated rounded-lg transition-colors"
                        title="Atualizar"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            disabled={actionLoading === 'all'}
                            className="text-sm text-primary-500 hover:text-primary-400 font-medium flex items-center gap-1"
                        >
                            {actionLoading === 'all' ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Check className="w-4 h-4" />
                            )}
                            Marcar todas como lidas
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-3">
                {notifications.map(n => (
                    <div
                        key={n.id}
                        className={`flex gap-4 p-4 rounded-xl border transition-all group ${n.read
                            ? 'bg-bg-surface border-border-subtle'
                            : 'bg-bg-elevated border-primary-500/30 shadow-sm'
                            }`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.read ? 'bg-bg-elevated' : 'bg-bg-surface'
                            }`}>
                            {getIcon(n.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className={`text-base font-semibold mb-1 ${n.read ? 'text-text-secondary' : 'text-text-primary'}`}>
                                {n.title}
                            </h4>
                            {n.description && (
                                <p className="text-sm text-text-secondary mb-2 truncate">{n.description}</p>
                            )}
                            <p className="text-xs text-text-muted">{formatTime(n.created_at)}</p>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!n.read && (
                                <button
                                    onClick={() => markAsRead(n.id)}
                                    disabled={actionLoading === n.id}
                                    title="Marcar como lida"
                                    className="p-2 text-text-muted hover:text-primary-500 hover:bg-bg-hover rounded-lg transition-colors"
                                >
                                    {actionLoading === n.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Check className="w-4 h-4" />
                                    )}
                                </button>
                            )}
                            <button
                                onClick={() => deleteNotification(n.id)}
                                disabled={actionLoading === n.id}
                                title="Excluir"
                                className="p-2 text-text-muted hover:text-error-400 hover:bg-bg-hover rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {notifications.length === 0 && (
                    <div className="text-center py-20 bg-bg-surface rounded-xl border border-border-subtle">
                        <Bell className="w-12 h-12 text-text-muted mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-text-primary">Nenhuma notificação</h3>
                        <p className="text-text-secondary">Você está em dia com tudo!</p>
                    </div>
                )}
            </div>

            {!supabase && (
                <div className="mt-6 bg-warning-500/10 border border-warning-500/30 rounded-xl p-4">
                    <p className="text-warning-500 text-sm">
                        <strong>Atenção:</strong> O Supabase não está configurado. Os dados exibidos são de demonstração.
                        Execute o SQL <code className="bg-bg-elevated px-1 rounded">supabase-notifications-schema.sql</code> para ativar.
                    </p>
                </div>
            )}
        </div>
    );
};
