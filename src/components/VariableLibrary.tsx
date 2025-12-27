import React, { useState } from 'react';
import { COMMON_VARIABLES, VariableCategory, CommonVariable } from '../data/commonVariables';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import clsx from 'clsx';

interface VariableLibraryProps {
    onInsertVariable: (variableName: string) => void;
}

export function VariableLibrary({ onInsertVariable }: VariableLibraryProps) {
    const [expandedCategories, setExpandedCategories] = useState<string[]>(['copywriting']);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const filteredCategories = searchQuery
        ? COMMON_VARIABLES.map(cat => ({
            ...cat,
            variables: cat.variables.filter(v =>
                v.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                v.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
        })).filter(cat => cat.variables.length > 0)
        : COMMON_VARIABLES;

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-3 border-b border-border-subtle">
                <h3 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                    Biblioteca de Variáveis
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
                {filteredCategories.map(category => (
                    <CategorySection
                        key={category.id}
                        category={category}
                        isExpanded={expandedCategories.includes(category.id) || !!searchQuery}
                        onToggle={() => toggleCategory(category.id)}
                        onInsertVariable={onInsertVariable}
                    />
                ))}
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
    category: VariableCategory;
    isExpanded: boolean;
    onToggle: () => void;
    onInsertVariable: (variableName: string) => void;
}

function CategorySection({ category, isExpanded, onToggle, onInsertVariable }: CategorySectionProps) {
    return (
        <div className="rounded-lg overflow-hidden border border-border-subtle/50">
            {/* Category Header */}
            <button
                onClick={onToggle}
                className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-bg-hover transition-colors"
                style={{ borderLeft: `3px solid ${category.color}` }}
            >
                <span className="flex items-center gap-2 text-sm font-medium text-text-primary">
                    <span>{category.icon}</span>
                    {category.label}
                    <span className="text-[10px] text-text-muted bg-bg-elevated px-1.5 py-0.5 rounded-full">
                        {category.variables.length}
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
                    {category.variables.map(variable => (
                        <VariableItem
                            key={variable.name}
                            variable={variable}
                            color={category.color}
                            onInsert={() => onInsertVariable(variable.name)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

interface VariableItemProps {
    variable: CommonVariable;
    color: string;
    onInsert: () => void;
}

function VariableItem({ variable, color, onInsert }: VariableItemProps) {
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
                    {variable.type === 'select' && (
                        <span className="text-[9px] text-text-muted bg-bg-elevated px-1 rounded">
                            {variable.options?.length} opções
                        </span>
                    )}
                </div>
                <p className="text-[11px] text-text-muted mt-0.5 line-clamp-1">
                    {variable.description}
                </p>
            </div>
        </button>
    );
}
