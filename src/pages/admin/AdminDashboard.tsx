import React from 'react';
import { Users, FileText, CreditCard, Activity, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, trend, icon: Icon, color }: any) => (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg ${color} bg-opacity-10 text-white`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            {trend && (
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
                    {trend > 0 ? '+' : ''}{trend}%
                </span>
            )}
        </div>
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
    </div>
);

export const AdminDashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Usuários Ativos"
                    value="1,234"
                    trend={12}
                    icon={Users}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Total de Prompts"
                    value="45.2k"
                    trend={8}
                    icon={FileText}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Receita Mensal"
                    value="R$ 12.5k"
                    trend={24}
                    icon={CreditCard}
                    color="bg-green-500"
                />
                <StatCard
                    title="Uso de API"
                    value="89%"
                    trend={-2}
                    icon={Activity}
                    color="bg-orange-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-gray-400" />
                        Crescimento de Usuários
                    </h3>
                    <div className="h-64 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-800 rounded-lg">
                        Gráfico de crescimento (Placeholder)
                    </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Atividade Recente</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="flex items-center gap-3 border-b border-gray-800 pb-3 last:border-0 last:pb-0">
                                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs">U{i}</div>
                                <div>
                                    <p className="text-sm text-white">Novo usuário registrado</p>
                                    <p className="text-xs text-gray-500">Há {i * 5} minutos</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
