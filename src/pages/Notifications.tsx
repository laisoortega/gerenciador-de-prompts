import React, { useState } from 'react';
import { Bell, UserPlus, Gift, Check, Info } from 'lucide-react';

const MOCK_NOTIFICATIONS = [
    { id: 1, type: 'share', title: 'Ana Silva compartilhou um prompt com você', description: 'Prompt: Gerador de Email de Vendas', time: '20 min atrás', read: false },
    { id: 2, type: 'system', title: 'Nova funcionalidade: Análise de Vídeo', description: 'Agora você pode analisar vídeos do YouTube diretamente!', time: '1h atrás', read: false },
    { id: 3, type: 'subscription', title: 'Seu período de teste acaba em 3 dias', description: 'Faça upgrade para não perder acesso aos recursos Pro.', time: '2h atrás', read: true },
    { id: 4, type: 'info', title: 'Bem-vindo ao PromptMaster!', description: 'Complete seu perfil para aproveitar ao máximo.', time: '1 dia atrás', read: true },
];

export const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

    const markAsRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'share': return <UserPlus className="w-5 h-5 text-blue-500" />;
            case 'system': return <Gift className="w-5 h-5 text-purple-500" />;
            case 'subscription': return <Info className="w-5 h-5 text-yellow-500" />;
            default: return <Bell className="w-5 h-5 text-gray-500" />;
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                    <Bell className="w-6 h-6" />
                    Notificações
                </h2>
                <button
                    onClick={markAllAsRead}
                    className="text-sm text-primary-500 hover:text-primary-400 font-medium"
                >
                    Marcar todas como lidas
                </button>
            </div>

            <div className="space-y-4">
                {notifications.map(n => (
                    <div
                        key={n.id}
                        className={`flex gap-4 p-4 rounded-xl border transition-all ${n.read
                            ? 'bg-bg-surface border-border-subtle opacity-75'
                            : 'bg-bg-elevated border-primary-500/30 shadow-sm'
                            }`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.read ? 'bg-bg-elevated' : 'bg-bg-surface'
                            }`}>
                            {getIcon(n.type)}
                        </div>

                        <div className="flex-1">
                            <h4 className={`text-base font-semibold mb-1 ${n.read ? 'text-text-secondary' : 'text-text-primary'}`}>
                                {n.title}
                            </h4>
                            <p className="text-sm text-text-secondary mb-2">{n.description}</p>
                            <p className="text-xs text-text-muted">{n.time}</p>
                        </div>

                        {!n.read && (
                            <button
                                onClick={() => markAsRead(n.id)}
                                title="Marcar como lida"
                                className="self-center p-2 text-text-muted hover:text-primary-500 hover:bg-bg-hover rounded-full"
                            >
                                <Check className="w-4 h-4" />
                            </button>
                        )}
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
        </div>
    );
};
