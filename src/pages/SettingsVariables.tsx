import React, { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, Variable, ChevronLeft, GripVertical } from 'lucide-react';
import { useCustomVariablesQuery } from '../hooks/useCustomVariablesQuery';
import { CustomVariable } from '../services/api';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useNavigate } from 'react-router-dom';

interface VariableFormData {
    name: string;
    label: string;
    description: string;
    type: 'text' | 'select' | 'multiselect';
    options: { value: string; label: string }[];
    placeholder: string;
    category: string;
}

const initialFormData: VariableFormData = {
    name: '',
    label: '',
    description: '',
    type: 'text',
    options: [],
    placeholder: '',
    category: 'custom'
};

// Default category options
const DEFAULT_CATEGORIES = [
    { value: 'copywriting', label: 'Copywriting' },
    { value: 'universal', label: 'Universal' },
    { value: 'imagens', label: 'Imagens' },
    { value: 'videos', label: 'Vídeos' },
    { value: 'custom', label: 'Personalizadas' }
];

export function SettingsVariables() {
    const navigate = useNavigate();
    const { variables, isLoading, addVariable, updateVariable, deleteVariable, isAdding, isUpdating } = useCustomVariablesQuery();

    const [isModalOpen, setModalOpen] = useState(false);
    const [editingVariable, setEditingVariable] = useState<CustomVariable | null>(null);
    const [formData, setFormData] = useState<VariableFormData>(initialFormData);
    const [newOption, setNewOption] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    // Get all unique categories from existing variables + defaults
    const allCategories = useMemo(() => {
        const fromVariables = variables.map(v => v.category).filter(Boolean);
        const fromDefaults = DEFAULT_CATEGORIES.map(c => c.value);
        const unique = [...new Set([...fromDefaults, ...fromVariables])];
        return unique.sort();
    }, [variables]);

    const handleOpenCreate = () => {
        setEditingVariable(null);
        setFormData(initialFormData);
        setModalOpen(true);
    };

    const handleOpenEdit = (variable: CustomVariable) => {
        setEditingVariable(variable);
        setFormData({
            name: variable.name,
            label: variable.label,
            description: variable.description || '',
            type: variable.type,
            options: variable.options || [],
            placeholder: variable.placeholder || '',
            category: variable.category || 'custom'
        });
        setModalOpen(true);
    };

    const handleSave = () => {
        const slug = formData.label
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_|_$/g, '');

        // Keep category as typed (just trim whitespace)
        const categoryValue = formData.category.trim() || 'custom';

        const data = {
            name: slug,
            label: formData.label,
            description: formData.description || undefined,
            type: formData.type,
            options: formData.type !== 'text' ? formData.options : [],
            placeholder: formData.type === 'text' ? formData.placeholder : undefined,
            category: categoryValue,
            is_active: true
        };

        if (editingVariable) {
            updateVariable({ id: editingVariable.id, data });
        } else {
            addVariable(data);
        }
        setModalOpen(false);
    };

    const handleAddOption = () => {
        if (newOption.trim()) {
            const value = newOption
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '_');
            setFormData({
                ...formData,
                options: [...formData.options, { value, label: newOption.trim() }]
            });
            setNewOption('');
        }
    };

    const handleRemoveOption = (index: number) => {
        setFormData({
            ...formData,
            options: formData.options.filter((_, i) => i !== index)
        });
    };

    const handleDelete = (id: string) => {
        deleteVariable(id);
        setDeleteConfirm(null);
    };

    return (
        <div className="min-h-screen bg-bg-base">
            {/* Header */}
            <div className="border-b border-border-subtle bg-bg-surface">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/settings')}
                            className="p-2 hover:bg-bg-hover rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-text-muted" />
                        </button>
                        <div>
                            <h1 className="text-xl font-semibold text-text-primary">Minhas Variáveis</h1>
                            <p className="text-sm text-text-muted">Crie variáveis reutilizáveis para seus prompts</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Add Button */}
                <div className="mb-6">
                    <Button onClick={handleOpenCreate} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Nova Variável
                    </Button>
                </div>

                {/* List */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                    </div>
                ) : variables.length === 0 ? (
                    <div className="text-center py-12 bg-bg-surface border border-border-subtle rounded-xl">
                        <Variable className="w-12 h-12 text-text-muted mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-text-primary mb-2">Nenhuma variável criada</h3>
                        <p className="text-text-muted mb-4">Crie variáveis personalizadas para usar em seus prompts</p>
                        <Button onClick={handleOpenCreate} variant="outline" className="gap-2">
                            <Plus className="w-4 h-4" />
                            Criar Primeira Variável
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {variables.map((variable) => (
                            <div
                                key={variable.id}
                                className="bg-bg-surface border border-border-subtle rounded-xl p-4 flex items-center gap-4 group hover:border-border-default transition-colors"
                            >
                                <div className="text-text-muted cursor-grab">
                                    <GripVertical className="w-4 h-4" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-text-primary">{variable.label}</span>
                                        <span className="text-xs px-2 py-0.5 bg-bg-elevated rounded text-text-muted">
                                            {`{{${variable.name}}}`}
                                        </span>
                                    </div>
                                    {variable.description && (
                                        <p className="text-sm text-text-muted truncate">{variable.description}</p>
                                    )}
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`text-xs px-2 py-0.5 rounded ${variable.type === 'text'
                                            ? 'bg-blue-500/10 text-blue-500'
                                            : variable.type === 'select'
                                                ? 'bg-green-500/10 text-green-500'
                                                : 'bg-purple-500/10 text-purple-500'
                                            }`}>
                                            {variable.type === 'text' ? 'Texto' : variable.type === 'select' ? 'Seleção' : 'Múltipla'}
                                        </span>
                                        {variable.options && variable.options.length > 0 && (
                                            <span className="text-xs text-text-muted">
                                                {variable.options.length} opções
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleOpenEdit(variable)}
                                        className="p-2 hover:bg-bg-hover rounded-lg transition-colors text-text-muted hover:text-text-primary"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(variable.id)}
                                        className="p-2 hover:bg-error-500/10 rounded-lg transition-colors text-text-muted hover:text-error-500"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <Modal open={isModalOpen} onClose={() => setModalOpen(false)} size="md">
                    <Modal.Header>
                        <h2 className="text-xl font-bold text-text-primary">
                            {editingVariable ? 'Editar Variável' : 'Nova Variável'}
                        </h2>
                    </Modal.Header>
                    <Modal.Body className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">Nome da Variável</label>
                            <input
                                type="text"
                                value={formData.label}
                                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                className="w-full px-4 py-2.5 bg-bg-elevated border border-border-default rounded-xl text-text-primary placeholder-text-muted focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30"
                                placeholder="Ex: Minha Marca"
                                autoFocus
                            />
                            {formData.label && (
                                <p className="text-xs text-text-muted mt-1">
                                    Slug: {`{{${formData.label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')}}}`}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">Descrição (opcional)</label>
                            <input
                                type="text"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2.5 bg-bg-elevated border border-border-default rounded-xl text-text-primary placeholder-text-muted focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30"
                                placeholder="Ex: Nome da marca para usar nos prompts"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">Categoria</label>
                            {!showNewCategory ? (
                                <>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => {
                                            if (e.target.value === '__nova__') {
                                                setShowNewCategory(true);
                                                setNewCategoryName('');
                                            } else {
                                                setFormData({ ...formData, category: e.target.value });
                                            }
                                        }}
                                        className="w-full px-4 py-2.5 bg-bg-elevated border border-border-default rounded-xl text-text-primary focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30"
                                    >
                                        {/* Show current category first if it's new (not in allCategories) */}
                                        {formData.category && !allCategories.includes(formData.category) && (
                                            <option value={formData.category}>
                                                {formData.category} (nova)
                                            </option>
                                        )}
                                        {allCategories.map(cat => (
                                            <option key={cat} value={cat}>
                                                {DEFAULT_CATEGORIES.find(c => c.value === cat)?.label || cat}
                                            </option>
                                        ))}
                                        <option value="__nova__">+ Criar nova categoria</option>
                                    </select>
                                    <p className="text-xs text-text-muted mt-1">Escolha uma categoria ou crie uma nova</p>
                                </>
                            ) : (
                                <>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                            className="flex-1 px-4 py-2.5 bg-bg-elevated border border-border-default rounded-xl text-text-primary placeholder-text-muted focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30"
                                            placeholder="Nome da nova categoria"
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (newCategoryName.trim()) {
                                                    setFormData({ ...formData, category: newCategoryName.trim() });
                                                }
                                                setShowNewCategory(false);
                                            }}
                                            className="px-4 py-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
                                        >
                                            OK
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowNewCategory(false)}
                                            className="px-4 py-2.5 bg-bg-elevated border border-border-default text-text-secondary rounded-xl hover:bg-bg-hover transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                    <p className="text-xs text-text-muted mt-1">Digite o nome da nova categoria</p>
                                </>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">Tipo</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['text', 'select', 'multiselect'] as const).map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type })}
                                        className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${formData.type === type
                                            ? 'bg-primary-500 border-primary-500 text-white'
                                            : 'bg-bg-elevated border-border-default text-text-secondary hover:border-primary-500'
                                            }`}
                                    >
                                        {type === 'text' ? 'Texto Livre' : type === 'select' ? 'Seleção Única' : 'Múltipla Seleção'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {formData.type === 'text' ? (
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1.5">Placeholder</label>
                                <input
                                    type="text"
                                    value={formData.placeholder}
                                    onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-bg-elevated border border-border-default rounded-xl text-text-primary placeholder-text-muted focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30"
                                    placeholder="Ex: Digite o nome da sua marca"
                                />
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1.5">Opções</label>

                                {/* Existing options */}
                                {formData.options.length > 0 && (
                                    <div className="space-y-2 mb-3">
                                        {formData.options.map((opt, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <span className="flex-1 px-3 py-2 bg-bg-elevated border border-border-subtle rounded-lg text-sm text-text-primary">
                                                    {opt.label}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveOption(index)}
                                                    className="p-2 hover:bg-error-500/10 rounded-lg text-text-muted hover:text-error-500"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Add new option */}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newOption}
                                        onChange={(e) => setNewOption(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOption())}
                                        className="flex-1 px-4 py-2.5 bg-bg-elevated border border-border-default rounded-xl text-text-primary placeholder-text-muted focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30"
                                        placeholder="Nova opção"
                                    />
                                    <Button type="button" onClick={handleAddOption} variant="outline">
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
                        <Button
                            onClick={handleSave}
                            disabled={!formData.label || (formData.type !== 'text' && formData.options.length === 0) || isAdding || isUpdating}
                        >
                            {isAdding || isUpdating ? 'Salvando...' : editingVariable ? 'Salvar' : 'Criar'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} size="sm">
                    <Modal.Header>
                        <h2 className="text-xl font-bold text-text-primary">Excluir Variável</h2>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="text-text-secondary">
                            Tem certeza que deseja excluir esta variável? Ela será removida de todos os prompts que a utilizam.
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
                        <Button
                            onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                            className="bg-error-500 hover:bg-error-600"
                        >
                            Excluir
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
}
