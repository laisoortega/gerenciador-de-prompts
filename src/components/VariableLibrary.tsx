import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Plus, PenTool, Image, Video, Globe, Braces, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { useCustomVariablesQuery } from '../hooks/useCustomVariablesQuery';
import { CustomVariable } from '../services/api';

// Category configuration with icons and colors
const CATEGORY_CONFIG: Record<string, { icon: React.ComponentType<any>; color: string; label: string }> = {
    copywriting: { icon: PenTool, color: '#3b82f6', label: 'Copywriting' },
    universal: { icon: Globe, color: '#8b5cf6', label: 'Universal' },
    imagens: { icon: Image, color: '#ec4899', label: 'Imagens' },
    videos: { icon: Video, color: '#f59e0b', label: 'Vídeos' },
    custom: { icon: Braces, color: '#10b981', label: 'Personalizadas' }
};

interface VariableLibraryProps {
    onInsertVariable: (variableName: string) => void;
}

export function VariableLibrary({ onInsertVariable }: VariableLibraryProps) {
    const { variables, isLoading } = useCustomVariablesQuery();
    const [expandedCategories, setExpandedCategories] = useState<string[]>(['copywriting', 'universal']);
    const [searchQuery, setSearchQuery] = useState('');

    // Group variables by category
    const variablesByCategory = useMemo(() => {
        const grouped: Record<string, CustomVariable[]> = {};

        variables.forEach(v => {
            const cat = v.category || 'custom';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(v);
        });

        return grouped;
    }, [variables]);

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    // Filter variables based on search
    const filteredCategories = useMemo(() => {
        if (!searchQuery) return variablesByCategory;

        const filtered: Record<string, CustomVariable[]> = {};
        Object.entries(variablesByCategory).forEach(([cat, vars]) => {
            const matches = vars.filter(v =>
                v.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (v.description || '').toLowerCase().includes(searchQuery.toLowerCase())
            );
            if (matches.length > 0) {
                filtered[cat] = matches;
            }
        });
        return filtered;
    }, [variablesByCategory, searchQuery]);

    const categoryOrder = ['copywriting', 'universal', 'imagens', 'videos', 'custom'];
    const sortedCategories = categoryOrder.filter(cat => filteredCategories[cat]?.length > 0);

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-3 border-b border-border-subtle">
                <h3 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                    Minhas Variáveis
                </h3>
                <input
                    type="text"
                    placeholder="Buscar variável..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-border-subtle bg-bg-surface text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
            </div>

            {/* Categories */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-5 h-5 animate-spin text-text-muted" />
                    </div>
                ) : sortedCategories.length === 0 ? (
                    <div className="text-center py-8">
                        <Braces className="w-8 h-8 text-text-muted mx-auto mb-2" />
                        <p className="text-xs text-text-muted">
                            {searchQuery ? 'Nenhuma variável encontrada' : 'Nenhuma variável criada ainda'}
                        </p>
                    </div>
                ) : (
                    sortedCategories.map(categoryId => {
                        const config = CATEGORY_CONFIG[categoryId] || CATEGORY_CONFIG.custom;
                        const categoryVariables = filteredCategories[categoryId] || [];

                        return (
                            <CategorySection
                                key={categoryId}
                                categoryId={categoryId}
                                label={config.label}
                                icon={config.icon}
                                color={config.color}
                                variables={categoryVariables}
                                isExpanded={expandedCategories.includes(categoryId) || !!searchQuery}
                                onToggle={() => toggleCategory(categoryId)}
                                onInsertVariable={onInsertVariable}
                            />
                        );
                    })
                )}
            </div>

            {/* Footer tip */}
            <div className="p-2 border-t border-border-subtle bg-bg-elevated/50">
                <p className="text-[10px] text-text-muted text-center">
                    Clique em uma variável para inserir no prompt
                </p>
            </div>
        </div>
    );
}

interface CategorySectionProps {
    categoryId: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    variables: CustomVariable[];
    isExpanded: boolean;
    onToggle: () => void;
    onInsertVariable: (variableName: string) => void;
}

function CategorySection({ categoryId, label, icon: Icon, color, variables, isExpanded, onToggle, onInsertVariable }: CategorySectionProps) {
    return (
        <div className="rounded-lg overflow-hidden border border-border-subtle/50">
            {/* Category Header */}
            <button
                onClick={onToggle}
                className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-bg-hover transition-colors"
                style={{ borderLeft: `3px solid ${color}` }}
            >
                <span className="flex items-center gap-2 text-sm font-medium text-text-primary">
                    <Icon className="w-4 h-4" style={{ color }} />
                    {label}
                    <span className="text-[10px] text-text-muted bg-bg-elevated px-1.5 py-0.5 rounded-full">
                        {variables.length}
                    </span>
                </span>
                {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-text-muted" />
                ) : (
                    <ChevronRight className="w-4 h-4 text-text-muted" />
                )}
            </button>

            {/* Variables List */}
            {isExpanded && (
                <div className="bg-bg-surface/50 border-t border-border-subtle/30">
                    {variables.map(variable => (
                        <VariableItem
                            key={variable.id}
                            variable={variable}
                            color={color}
                            onInsert={() => onInsertVariable(variable.name)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

interface VariableItemProps {
    variable: CustomVariable;
    color: string;
    onInsert: () => void;
}

function VariableItem({ variable, color, onInsert }: VariableItemProps) {
    const optionsCount = Array.isArray(variable.options) ? variable.options.length : 0;

    return (
        <button
            onClick={onInsert}
            className="w-full px-3 py-2 flex items-start gap-2 text-left hover:bg-bg-hover/50 transition-colors group border-b border-border-subtle/20 last:border-b-0"
        >
            <Plus className="w-3.5 h-3.5 mt-0.5 text-text-muted group-hover:text-primary-500 transition-colors flex-shrink-0" />
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <code
                        className="text-xs font-mono px-1.5 py-0.5 rounded"
                        style={{
                            backgroundColor: `${color}15`,
                            color: color,
                            border: `1px solid ${color}30`
                        }}
                    >
                        {`{{${variable.name}}}`}
                    </code>
                    {variable.type === 'select' && optionsCount > 0 && (
                        <span className="text-[9px] text-text-muted bg-bg-elevated px-1 rounded">
                            {optionsCount} opções
                        </span>
                    )}
                </div>
                {variable.description && (
                    <p className="text-[11px] text-text-muted mt-0.5 line-clamp-1">
                        {variable.description}
                    </p>
                )}
            </div>
        </button>
    );
}
