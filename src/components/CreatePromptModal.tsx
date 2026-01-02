import { useState, useEffect, useRef, useMemo } from 'react';
import { Prompt } from '../types';
import { useStore } from '../contexts/StoreContext';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useCustomVariablesQuery } from '../hooks/useCustomVariablesQuery';
import { ChevronDown, Plus, X, Braces, Search } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { HighlightedPromptEditor } from './ui/HighlightedPromptEditor';

export function CreatePromptModal({ onClose, initialData }: { onClose: () => void; initialData?: Prompt }) {
    const { addPrompt, updatePrompt, activeWorkspaceId, prompts, categories } = useStore();
    const { variables: libraryVariables, isLoading: loadingVariables } = useCustomVariablesQuery();

    const [title, setTitle] = useState(initialData?.title || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [tags, setTags] = useState<string[]>(initialData?.tags || []);
    const [tagInput, setTagInput] = useState('');
    const [detectedVariables, setDetectedVariables] = useState<{ name: string, default?: string }[]>([]);
    const [variableSearch, setVariableSearch] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Derive unique tags from existing prompts
    const existingTags = useMemo(() => {
        const allTags: string[] = [];
        prompts.forEach(p => {
            if (Array.isArray(p.tags)) {
                allTags.push(...p.tags);
            }
        });
        return [...new Set(allTags)].sort();
    }, [prompts]);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setContent(initialData.content);
            setTags(initialData.tags || []);
            if (initialData.variables) {
                setDetectedVariables(initialData.variables.map(v => ({ name: v.name, default: v.default || v.value })));
            }
        } else {
            setTitle('');
            setContent('');
            setTags([]);
            setDetectedVariables([]);
        }
    }, [initialData]);

    // Auto-detect variables from content
    useEffect(() => {
        const regex = /\{\{([^}]+)\}\}/g;
        const matches = [...content.matchAll(regex)].map(m => m[1].trim());
        const uniqueMatches = Array.from(new Set(matches));

        setDetectedVariables(prev => {
            const newVars = uniqueMatches.map(name => {
                const existing = prev.find(p => p.name === name);
                return { name, default: existing?.default || '' };
            });
            return newVars;
        });
    }, [content]);

    const handleInsertVariable = (variableName: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const variableText = `{{${variableName}}}`;

        const newContent = content.substring(0, start) + variableText + content.substring(end);
        setContent(newContent);

        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + variableText.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);

        setVariableSearch('');
    };

    const handleAddTag = (tag: string) => {
        const trimmed = tag.trim().toLowerCase();
        if (trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed]);
        }
        setTagInput('');
    };

    const handleRemoveTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
    };

    const handleSave = () => {
        const finalVariables = detectedVariables.map(v => ({
            name: v.name,
            default: v.default || '',
        }));

        const promptData = {
            title,
            content,
            variables: finalVariables,
            tags,
            recommended_ai: 'gpt-4' as const,
            workspace_id: activeWorkspaceId,
            is_favorite: initialData?.is_favorite || false
        };

        if (initialData) {
            updatePrompt(initialData.id, promptData);
        } else {
            addPrompt(promptData);
        }
        onClose();
    };

    // Filter library variables by search
    const filteredLibraryVariables = useMemo(() => {
        if (!variableSearch) return libraryVariables;
        const q = variableSearch.toLowerCase();
        return libraryVariables.filter(v =>
            v.name.toLowerCase().includes(q) ||
            v.label.toLowerCase().includes(q) ||
            (v.description || '').toLowerCase().includes(q)
        );
    }, [libraryVariables, variableSearch]);

    // Suggestions for tags
    const tagSuggestions = useMemo(() => {
        if (!tagInput) return [];
        const q = tagInput.toLowerCase();
        return existingTags
            .filter(t => t.toLowerCase().includes(q) && !tags.includes(t))
            .slice(0, 5);
    }, [tagInput, existingTags, tags]);

    return (
        <Modal size="lg" onClose={onClose}>
            <Modal.Header>
                <h2 className="text-lg font-bold text-text-primary">
                    {initialData ? 'Editar Prompt' : 'Novo Prompt'}
                </h2>
                <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </Modal.Header>

            <Modal.Body className="space-y-5">
                {/* Título */}
                <Input
                    label="Título"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Email de Vendas"
                />

                {/* Tags */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map(tag => (
                            <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-500/15 text-primary-400 rounded-full text-xs font-medium"
                            >
                                #{tag}
                                <button
                                    onClick={() => handleRemoveTag(tag)}
                                    className="hover:text-primary-300 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && tagInput.trim()) {
                                    e.preventDefault();
                                    handleAddTag(tagInput);
                                }
                            }}
                            className="w-full h-10 px-3 rounded-xl border border-border-default bg-bg-surface text-sm text-text-primary focus:border-primary-500"
                            placeholder="Digite uma tag e pressione Enter"
                        />
                        {tagSuggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-bg-elevated border border-border-subtle rounded-xl shadow-lg z-10 py-1">
                                {tagSuggestions.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => handleAddTag(tag)}
                                        className="w-full px-3 py-2 text-left text-sm text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors"
                                    >
                                        #{tag}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        Conteúdo do Prompt
                    </label>
                    <HighlightedPromptEditor
                        value={content}
                        onChange={setContent}
                        placeholder="Escreva seu prompt... Use {{variavel}} para variáveis."
                        minHeight="180px"
                    />

                    {/* Botão de Inserir Variável - Dropdown */}
                    <div className="flex items-center gap-3 mt-2">
                        <Menu as="div" className="relative">
                            <Menu.Button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-primary-500 bg-bg-elevated hover:bg-bg-hover border border-border-subtle rounded-lg transition-colors">
                                <Plus className="w-3.5 h-3.5" />
                                Inserir Variável
                                <ChevronDown className="w-3 h-3" />
                            </Menu.Button>
                            <Transition
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute left-0 bottom-full mb-1 w-72 origin-bottom-left rounded-xl bg-bg-elevated border border-border-subtle shadow-xl z-[100] overflow-hidden">
                                    {/* Search */}
                                    <div className="p-2 border-b border-border-subtle">
                                        <div className="relative">
                                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                                            <input
                                                type="text"
                                                placeholder="Buscar variável..."
                                                value={variableSearch}
                                                onChange={(e) => setVariableSearch(e.target.value)}
                                                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border-subtle bg-bg-surface text-text-primary placeholder-text-muted focus:outline-none focus:border-primary-500"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                    </div>

                                    {/* Variables List */}
                                    <div className="max-h-60 overflow-y-auto py-1">
                                        {loadingVariables ? (
                                            <div className="px-3 py-4 text-center text-xs text-text-muted">
                                                Carregando...
                                            </div>
                                        ) : filteredLibraryVariables.length === 0 ? (
                                            <div className="px-3 py-4 text-center">
                                                <Braces className="w-6 h-6 text-text-muted mx-auto mb-1" />
                                                <p className="text-xs text-text-muted">
                                                    {variableSearch ? 'Nenhuma variável encontrada' : 'Nenhuma variável criada'}
                                                </p>
                                                <p className="text-[10px] text-text-muted mt-1">
                                                    Crie variáveis em Configurações → Variáveis
                                                </p>
                                            </div>
                                        ) : (
                                            filteredLibraryVariables.map(variable => (
                                                <Menu.Item key={variable.id}>
                                                    {({ active }) => (
                                                        <button
                                                            onClick={() => handleInsertVariable(variable.name)}
                                                            className={`w-full px-3 py-2 text-left transition-colors ${active ? 'bg-bg-hover' : ''
                                                                }`}
                                                        >
                                                            <code className="text-xs font-mono text-primary-400 bg-primary-500/10 px-1.5 py-0.5 rounded">
                                                                {`{{${variable.name}}}`}
                                                            </code>
                                                            {variable.description && (
                                                                <p className="text-[11px] text-text-muted mt-0.5 line-clamp-1">
                                                                    {variable.description}
                                                                </p>
                                                            )}
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                            ))
                                        )}
                                    </div>

                                    {/* Quick Add */}
                                    <div className="p-2 border-t border-border-subtle bg-bg-surface/50">
                                        <p className="text-[10px] text-text-muted">
                                            Ou digite <code className="text-primary-400">{"{{nome}}"}</code> direto no texto
                                        </p>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>

                        <span className="text-xs text-text-muted">
                            {content.length} caracteres
                        </span>
                    </div>
                </div>

                {/* Detected Variables - Valores padrão */}
                {detectedVariables.length > 0 && (
                    <div className="bg-bg-elevated rounded-xl p-4 border border-border-subtle">
                        <h4 className="text-sm font-medium text-text-primary mb-3 flex items-center gap-2">
                            <Braces className="w-4 h-4 text-primary-500" />
                            {detectedVariables.length} Variáveis Detectadas
                        </h4>
                        <div className="grid gap-2">
                            {detectedVariables.map(v => (
                                <div key={v.name} className="flex items-center gap-3">
                                    <code className="text-xs text-primary-500 bg-primary-500/10 px-2 py-1 rounded font-mono min-w-[100px]">
                                        {`{{${v.name}}}`}
                                    </code>
                                    <input
                                        type="text"
                                        placeholder="Valor padrão (opcional)"
                                        className="flex-1 h-8 px-3 text-sm bg-bg-surface border border-border-default rounded-lg text-text-primary focus:border-primary-500"
                                        value={v.default || ''}
                                        onChange={(e) => {
                                            setDetectedVariables(prev =>
                                                prev.map(p => p.name === v.name ? { ...p, default: e.target.value } : p)
                                            );
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer>
                <div className="flex justify-end gap-3 w-full">
                    <Button variant="ghost" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={!title || !content}>
                        {initialData ? 'Salvar' : 'Criar Prompt'}
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
}
