import React from 'react';
import { Check, Edit, Plus } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';

export const PlanManagement: React.FC = () => {
    const { plans } = useStore();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Gerenciar Planos</h2>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <Plus className="w-4 h-4" /> Novo Plano
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map(plan => (
                    <div key={plan.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-gray-400 hover:text-white bg-gray-800 p-2 rounded-lg">
                                <Edit className="w-4 h-4" />
                            </button>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-2xl font-bold text-white">R$ {plan.price_monthly}</span>
                            <span className="text-gray-500">/mês</span>
                        </div>

                        <div className="space-y-3 mb-8 flex-1">
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <Check className="w-4 h-4 text-green-500" />
                                {plan.max_prompts === -1 ? 'Prompts Ilimitados' : `${plan.max_prompts} Prompts`}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <Check className="w-4 h-4 text-green-500" />
                                {plan.max_workspaces} Workspaces
                            </div>
                            {plan.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                                    <Check className="w-4 h-4 text-green-500" />
                                    {feature}
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-gray-800">
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>ID: {plan.id}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
