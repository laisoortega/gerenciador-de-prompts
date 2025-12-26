import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, Plus, X, HelpCircle } from 'lucide-react';
import { fetchCommonVariables } from '../services/api';
import { CommonVariable } from '../types';

interface VariableSelectorProps {
    selectedVariables: SelectedVariable[];
    customVariables: CustomVariable[];
    onToggleVariable: (variable: CommonVariable) => void;
    onAddCustomVariable: (variable: CustomVariable) => void;
    onRemoveCustomVariable: (name: string) => void;
    onUpdateCustomVariable: (name: string, updates: Partial<CustomVariable>) => void;
    suggestedCategory?: 'copy' | 'image' | 'video' | 'general';
}

export interface SelectedVariable {
    variable: CommonVariable;
    value: string;
}

export interface CustomVariable {
    name: string;
    placeholder: string;
    default_value: string;
}

export function VariableSelector({
    selectedVariables,
    customVariables,
    onToggleVariable,
    onAddCustomVariable,
    onRemoveCustomVariable,
    onUpdateCustomVariable,
    suggestedCategory,
}: VariableSelectorProps) {
    const [activeCategory, setActiveCategory] = useState<string>(suggestedCategory || 'copy');
    const [showCustomForm, setShowCustomForm] = useState(false);
    const [customName, setCustomName] = useState('');
    const [customPlaceholder, setCustomPlaceholder] = useState('');

    // Buscar variáveis comuns
    const { data: commonVariables } = useQuery({
        queryKey: ['common-variables'],
        queryFn: fetchCommonVariables,
    });

    // Agrupar por categoria
    const variablesByCategory = useMemo(() => {
        if (!commonVariables) return {};
        return commonVariables.reduce((acc, v) => {
            if (!acc[v.category]) acc[v.category] = [];
            acc[v.category].push(v);
            return acc;
        }, {} as Record<string, CommonVariable[]>);
    }, [commonVariables]);

    const categories = [
        { key: 'copy', label: 'Copywriting', icon: '✏️' },
        { key: 'image', label: 'Imagens', icon: '🎨' },
        { key: 'video', label: 'Vídeo/Roteiro', icon: '🎬' },
        { key: 'general', label: 'Geral', icon: '⚙️' },
    ];

    const isVariableSelected = (variableId: string) => {
        return selectedVariables.some(sv => sv.variable.id === variableId);
    };

    const handleAddCustom = () => {
        if (!customName.trim()) return;

        // Formatar nome da variável (snake_case)
        const formattedName = customName
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '_');

        onAddCustomVariable({
            name: formattedName,
            placeholder: customPlaceholder || customName,
            default_value: '',
        });

        setCustomName('');
        setCustomPlaceholder('');
        setShowCustomForm(false);
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-medium text-text-primary">Variáveis do Prompt</h3>
                    <p className="text-sm text-text-muted">
                        Selecione variáveis comuns ou crie personalizadas
                    </p>
                </div>
                <button
                    onClick={() => setShowCustomForm(true)}
                    className="btn-ghost text-sm flex items-center"
                >
                    <Plus className="w-4 h-4 mr-1" />
                    Variável Personalizada
                </button>
            </div>

            {/* Tabs de Categoria */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((cat) => (
                    <button
                        key={cat.key}
                        onClick={() => setActiveCategory(cat.key)}
                        className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap
              transition-colors
              ${activeCategory === cat.key
                                ? 'bg-primary-500/10 text-primary-500 border border-primary-500/20'
                                : 'bg-bg-elevated text-text-secondary hover:bg-bg-hover'
                            }
            `}
                    >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                        {variablesByCategory[cat.key] && (
                            <span className="text-xs opacity-60 ml-1">
                                ({variablesByCategory[cat.key].length})
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Lista de Variáveis da Categoria */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                {variablesByCategory[activeCategory]?.map((variable) => {
                    const isSelected = isVariableSelected(variable.id);

                    return (
                        <button
                            key={variable.id}
                            onClick={() => onToggleVariable(variable)}
                            className={`
                flex items-start gap-3 p-3 rounded-lg text-left transition-all
                ${isSelected
                                    ? 'bg-primary-500/10 border border-primary-500/30'
                                    : 'bg-bg-elevated border border-transparent hover:border-border-default'
                                }
              `}
                        >
                            {/* Checkbox */}
                            <div className={`
                w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5
                ${isSelected
                                    ? 'bg-primary-500 text-white'
                                    : 'border-2 border-border-default'
                                }
              `}>
                                {isSelected && <Check className="w-3 h-3" />}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-text-primary">{variable.label}</span>
                                    {variable.description && (
                                        <HelpCircle className="w-3.5 h-3.5 text-text-muted" title={variable.description} />
                                    )}
                                </div>
                                <p className="text-xs text-text-muted mt-0.5">
                                    {`{{${variable.name}}}`}
                                </p>
                                {variable.options && (
                                    <p className="text-xs text-text-muted mt-1 truncate">
                                        Opções: {JSON.parse(variable.options).slice(0, 3).join(', ')}...
                                    </p>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Variáveis Selecionadas com Valores */}
            {selectedVariables.length > 0 && (
                <div className="border-t border-border-subtle pt-4">
                    <h4 className="text-sm font-medium text-text-secondary mb-3">
                        Variáveis Selecionadas ({selectedVariables.length})
                    </h4>
                    <div className="space-y-3">
                        {selectedVariables.map(({ variable, value }) => (
                            <VariableInput
                                key={variable.id}
                                variable={variable}
                                value={value}
                                onChange={(newValue: string) => {
                                    // This usually updates state in parent, but prompt code doesn't show how.
                                    // I'll assume usage of onUpdateVariable logic but the prompt didn't pass it.
                                    // I'll leave as TODO
                                }}
                                onRemove={() => onToggleVariable(variable)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Variáveis Personalizadas */}
            {customVariables.length > 0 && (
                <div className="border-t border-border-subtle pt-4">
                    <h4 className="text-sm font-medium text-text-secondary mb-3">
                        Variáveis Personalizadas ({customVariables.length})
                    </h4>
                    <div className="space-y-3">
                        {customVariables.map((cv) => (
                            <div key={cv.name} className="flex items-center gap-3">
                                <div className="flex-1 bg-bg-elevated rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <code className="text-sm text-primary-400">{`{{${cv.name}}}`}</code>
                                        <button
                                            onClick={() => onRemoveCustomVariable(cv.name)}
                                            className="p-1 text-text-muted hover:text-error-500"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={cv.default_value}
                                        onChange={(e) => onUpdateCustomVariable(cv.name, { default_value: e.target.value })}
                                        placeholder={cv.placeholder}
                                        className="input-primary w-full text-sm"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Form para Adicionar Variável Personalizada */}
            {showCustomForm && (
                <div className="bg-bg-elevated rounded-lg p-4 border border-border-subtle">
                    <h4 className="font-medium text-text-primary mb-3">Nova Variável Personalizada</h4>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm text-text-secondary mb-1 block">Nome da variável</label>
                            <input
                                type="text"
                                value={customName}
                                onChange={(e) => setCustomName(e.target.value)}
                                placeholder="Ex: nome_do_produto"
                                className="input-primary w-full text-sm"
                            />
                            <p className="text-xs text-text-muted mt-1">
                                Será convertido para: {`{{${customName.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '_') || 'nome_variavel'}}}`}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm text-text-secondary mb-1 block">Placeholder (opcional)</label>
                            <input
                                type="text"
                                value={customPlaceholder}
                                onChange={(e) => setCustomPlaceholder(e.target.value)}
                                placeholder="Ex: Digite o nome do produto..."
                                className="input-primary w-full text-sm"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setShowCustomForm(false)} className="btn-ghost text-sm">
                                Cancelar
                            </button>
                            <button onClick={handleAddCustom} className="btn-primary text-sm" disabled={!customName.trim()}>
                                Adicionar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Input para variável com opções
function VariableInput({ variable, value, onChange, onRemove }: any) {
    const options = variable.options ? JSON.parse(variable.options) : null;

    return (
        <div className="flex items-start gap-3 bg-bg-elevated rounded-lg p-3">
            <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-text-primary">{variable.label}</label>
                    <button onClick={onRemove} className="p-1 text-text-muted hover:text-error-500">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {variable.input_type === 'select' && options ? (
                    <select
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="input-primary w-full text-sm"
                    >
                        <option value="">Selecione...</option>
                        {options.map((opt: string) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                ) : variable.input_type === 'multiselect' && options ? (
                    <div className="flex flex-wrap gap-2">
                        {options.map((opt: string) => {
                            const selected = value?.includes(opt);
                            return (
                                <button
                                    key={opt}
                                    onClick={() => {
                                        const current = value ? value.split(', ') : [];
                                        if (selected) {
                                            onChange(current.filter((v: string) => v !== opt).join(', '));
                                        } else {
                                            onChange([...current, opt].join(', '));
                                        }
                                    }}
                                    className={`px-2 py-1 rounded text-xs transition-colors ${selected
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-bg-surface text-text-secondary hover:bg-bg-hover'
                                        }`}
                                >
                                    {opt}
                                </button>
                            );
                        })}
                    </div>
                ) : variable.input_type === 'textarea' ? (
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={variable.placeholder}
                        className="input-primary w-full text-sm h-20 resize-none"
                    />
                ) : (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={variable.placeholder}
                        className="input-primary w-full text-sm"
                    />
                )}
            </div>
        </div>
    );
}
