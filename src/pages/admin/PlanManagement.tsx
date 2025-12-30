import React, { useState, useEffect } from 'react';
import { Check, Edit, Plus, Loader2, X, Save, Trash2, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Plan {
    id: string;
    name: string;
    slug: string;
    description: string;
    price_monthly: number;
    price_yearly: number;
    max_prompts: number;
    max_workspaces: number;
    max_variables: number;
    features: string[];
    is_active: boolean;
    is_featured: boolean;
    sort_order: number;
}

const defaultPlan: Partial<Plan> = {
    name: '',
    slug: '',
    description: '',
    price_monthly: 0,
    price_yearly: 0,
    max_prompts: 50,
    max_workspaces: 1,
    max_variables: 20,
    features: [],
    is_active: true,
    is_featured: false,
    sort_order: 0
};

export const PlanManagement: React.FC = () => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingPlan, setEditingPlan] = useState<Partial<Plan> | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [newFeature, setNewFeature] = useState('');

    useEffect(() => {
        loadPlans();
    }, []);

    const loadPlans = async () => {
        if (!supabase) {
            // Mock data
            setPlans([
                { id: '1', name: 'Free', slug: 'free', description: 'Para começar', price_monthly: 0, price_yearly: 0, max_prompts: 50, max_workspaces: 1, max_variables: 10, features: ['50 prompts', '1 workspace'], is_active: true, is_featured: false, sort_order: 1 },
                { id: '2', name: 'Pro', slug: 'pro', description: 'Para profissionais', price_monthly: 29, price_yearly: 290, max_prompts: 500, max_workspaces: 5, max_variables: 50, features: ['500 prompts', '5 workspaces', 'Suporte prioritário'], is_active: true, is_featured: true, sort_order: 2 },
            ]);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('plans')
                .select('*')
                .order('sort_order');

            if (error) throw error;

            setPlans((data || []).map(p => ({
                ...p,
                features: Array.isArray(p.features) ? p.features : JSON.parse(p.features || '[]')
            })));
        } catch (err) {
            console.error('Failed to load plans:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const savePlan = async () => {
        if (!editingPlan || !supabase) return;

        setIsSaving(true);
        try {
            const payload = {
                name: editingPlan.name,
                slug: editingPlan.slug,
                description: editingPlan.description,
                price_monthly: editingPlan.price_monthly,
                price_yearly: editingPlan.price_yearly,
                max_prompts: editingPlan.max_prompts,
                max_workspaces: editingPlan.max_workspaces,
                max_variables: editingPlan.max_variables,
                features: editingPlan.features,
                is_active: editingPlan.is_active,
                is_featured: editingPlan.is_featured,
                sort_order: editingPlan.sort_order,
                updated_at: new Date().toISOString()
            };

            if (editingPlan.id) {
                // Update existing
                const { error } = await supabase
                    .from('plans')
                    .update(payload)
                    .eq('id', editingPlan.id);

                if (error) throw error;
            } else {
                // Create new
                const { error } = await supabase
                    .from('plans')
                    .insert(payload);

                if (error) throw error;
            }

            await loadPlans();
            setEditingPlan(null);
        } catch (err) {
            console.error('Failed to save plan:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const deletePlan = async (planId: string) => {
        if (!supabase || !confirm('Tem certeza que deseja excluir este plano?')) return;

        try {
            const { error } = await supabase
                .from('plans')
                .delete()
                .eq('id', planId);

            if (error) throw error;
            await loadPlans();
        } catch (err) {
            console.error('Failed to delete plan:', err);
        }
    };

    const addFeature = () => {
        if (!newFeature.trim() || !editingPlan) return;
        setEditingPlan({
            ...editingPlan,
            features: [...(editingPlan.features || []), newFeature.trim()]
        });
        setNewFeature('');
    };

    const removeFeature = (index: number) => {
        if (!editingPlan) return;
        setEditingPlan({
            ...editingPlan,
            features: (editingPlan.features || []).filter((_, i) => i !== index)
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                    <p className="text-text-muted">Carregando planos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary">Gerenciar Planos</h2>
                    <p className="text-text-muted text-sm mt-1">{plans.length} planos configurados</p>
                </div>
                <button
                    onClick={() => setEditingPlan({ ...defaultPlan })}
                    className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
                >
                    <Plus className="w-4 h-4" /> Novo Plano
                </button>
            </div>

            {/* Edit Modal */}
            {editingPlan && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-bg-surface border border-border-default rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-border-subtle flex justify-between items-center">
                            <h3 className="text-xl font-bold text-text-primary">
                                {editingPlan.id ? 'Editar Plano' : 'Novo Plano'}
                            </h3>
                            <button onClick={() => setEditingPlan(null)} className="text-text-muted hover:text-text-primary">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Nome</label>
                                    <input
                                        type="text"
                                        value={editingPlan.name || ''}
                                        onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-bg-elevated border border-border-default rounded-xl text-text-primary"
                                        placeholder="Ex: Pro"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Slug</label>
                                    <input
                                        type="text"
                                        value={editingPlan.slug || ''}
                                        onChange={(e) => setEditingPlan({ ...editingPlan, slug: e.target.value.toLowerCase().replace(/\s/g, '-') })}
                                        className="w-full px-3 py-2.5 bg-bg-elevated border border-border-default rounded-xl text-text-primary"
                                        placeholder="Ex: pro"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1.5">Descrição</label>
                                <input
                                    type="text"
                                    value={editingPlan.description || ''}
                                    onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                                    className="w-full px-3 py-2.5 bg-bg-elevated border border-border-default rounded-xl text-text-primary"
                                    placeholder="Ex: Para profissionais e criadores"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Preço Mensal (R$)</label>
                                    <input
                                        type="number"
                                        value={editingPlan.price_monthly || 0}
                                        onChange={(e) => setEditingPlan({ ...editingPlan, price_monthly: Number(e.target.value) })}
                                        className="w-full px-3 py-2.5 bg-bg-elevated border border-border-default rounded-xl text-text-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Preço Anual (R$)</label>
                                    <input
                                        type="number"
                                        value={editingPlan.price_yearly || 0}
                                        onChange={(e) => setEditingPlan({ ...editingPlan, price_yearly: Number(e.target.value) })}
                                        className="w-full px-3 py-2.5 bg-bg-elevated border border-border-default rounded-xl text-text-primary"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Max Prompts</label>
                                    <input
                                        type="number"
                                        value={editingPlan.max_prompts || 0}
                                        onChange={(e) => setEditingPlan({ ...editingPlan, max_prompts: Number(e.target.value) })}
                                        className="w-full px-3 py-2.5 bg-bg-elevated border border-border-default rounded-xl text-text-primary"
                                    />
                                    <p className="text-xs text-text-muted mt-1">-1 = ilimitado</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Max Workspaces</label>
                                    <input
                                        type="number"
                                        value={editingPlan.max_workspaces || 0}
                                        onChange={(e) => setEditingPlan({ ...editingPlan, max_workspaces: Number(e.target.value) })}
                                        className="w-full px-3 py-2.5 bg-bg-elevated border border-border-default rounded-xl text-text-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Max Variáveis</label>
                                    <input
                                        type="number"
                                        value={editingPlan.max_variables || 0}
                                        onChange={(e) => setEditingPlan({ ...editingPlan, max_variables: Number(e.target.value) })}
                                        className="w-full px-3 py-2.5 bg-bg-elevated border border-border-default rounded-xl text-text-primary"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1.5">Features</label>
                                <div className="space-y-2 mb-2">
                                    {(editingPlan.features || []).map((feature, index) => (
                                        <div key={index} className="flex items-center gap-2 bg-bg-elevated px-3 py-2 rounded-lg">
                                            <Check className="w-4 h-4 text-success-500" />
                                            <span className="flex-1 text-text-primary text-sm">{feature}</span>
                                            <button onClick={() => removeFeature(index)} className="text-text-muted hover:text-error-400">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newFeature}
                                        onChange={(e) => setNewFeature(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addFeature()}
                                        className="flex-1 px-3 py-2 bg-bg-elevated border border-border-default rounded-xl text-text-primary text-sm"
                                        placeholder="Nova feature..."
                                    />
                                    <button onClick={addFeature} className="px-3 py-2 bg-bg-elevated border border-border-default rounded-xl text-text-primary hover:bg-bg-surface">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={editingPlan.is_active}
                                        onChange={(e) => setEditingPlan({ ...editingPlan, is_active: e.target.checked })}
                                        className="w-4 h-4 rounded border-border-default"
                                    />
                                    <span className="text-sm text-text-secondary">Ativo</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={editingPlan.is_featured}
                                        onChange={(e) => setEditingPlan({ ...editingPlan, is_featured: e.target.checked })}
                                        className="w-4 h-4 rounded border-border-default"
                                    />
                                    <span className="text-sm text-text-secondary">Destacado</span>
                                </label>
                            </div>
                        </div>
                        <div className="p-6 border-t border-border-subtle flex justify-end gap-3">
                            <button
                                onClick={() => setEditingPlan(null)}
                                className="px-4 py-2 text-text-secondary hover:text-text-primary"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={savePlan}
                                disabled={isSaving || !editingPlan.name || !editingPlan.slug}
                                className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map(plan => (
                    <div
                        key={plan.id}
                        className={`bg-bg-surface border rounded-xl p-6 flex flex-col relative overflow-hidden group ${plan.is_featured ? 'border-primary-500 ring-1 ring-primary-500/30' : 'border-border-subtle'
                            }`}
                    >
                        {plan.is_featured && (
                            <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs px-3 py-1 rounded-bl-lg flex items-center gap-1">
                                <Star className="w-3 h-3" /> Popular
                            </div>
                        )}

                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button
                                onClick={() => setEditingPlan(plan)}
                                className="text-text-muted hover:text-text-primary bg-bg-elevated p-2 rounded-lg"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => deletePlan(plan.id)}
                                className="text-text-muted hover:text-error-400 bg-bg-elevated p-2 rounded-lg"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <h3 className="text-xl font-bold text-text-primary mb-1">{plan.name}</h3>
                        <p className="text-text-muted text-sm mb-4">{plan.description}</p>

                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-3xl font-bold text-text-primary">R$ {plan.price_monthly}</span>
                            <span className="text-text-muted">/mês</span>
                        </div>

                        <div className="space-y-2.5 mb-6 flex-1">
                            {plan.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2.5 text-sm text-text-secondary">
                                    <Check className="w-4 h-4 text-success-500 flex-shrink-0" />
                                    {feature}
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-border-subtle flex justify-between items-center">
                            <span className={`text-xs px-2 py-1 rounded-full ${plan.is_active ? 'bg-success-500/20 text-success-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                {plan.is_active ? 'Ativo' : 'Inativo'}
                            </span>
                            <span className="text-xs text-text-muted">ID: {plan.id.slice(0, 8)}</span>
                        </div>
                    </div>
                ))}
            </div>

            {!supabase && (
                <div className="bg-warning-500/10 border border-warning-500/30 rounded-xl p-4">
                    <p className="text-warning-500 text-sm">
                        <strong>Atenção:</strong> O Supabase não está configurado. Os dados exibidos são de demonstração.
                        Execute o SQL <code className="bg-bg-elevated px-1 rounded">supabase-plans-schema.sql</code> para ativar.
                    </p>
                </div>
            )}
        </div>
    );
};
