import { useState, useEffect, useMemo } from 'react';
import { Prompt } from '../types';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Copy, Check, X, Braces, Pencil, Trash2 } from 'lucide-react';
import { RunPromptButton } from './RunPromptButton';
import { findVariable, getVariableCategory } from '../data/commonVariables';
import { useStore } from '../contexts/StoreContext';
import { HighlightedPromptEditor } from './ui/HighlightedPromptEditor';

interface UsePromptModalProps {
    prompt: Prompt;
    onClose: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

export function UsePromptModal({ prompt, onClose, onEdit, onDelete }: UsePromptModalProps) {
    const { incrementCopyCount } = useStore();
    // Extract variables from prompt content
    const promptVariables = useMemo(() => {
        const regex = /\{\{([^}]+)\}\}/g;
        const matches = [...prompt.content.matchAll(regex)].map(m => m[1].trim());
        return Array.from(new Set(matches));
    }, [prompt.content]);

    // State for variable values
    const [variableValues, setVariableValues] = useState<Record<string, string>>(() => {
        const initial: Record<string, string> = {};
        promptVariables.forEach(name => {
            const promptVar = prompt.variables?.find(v => v.name === name);
            initial[name] = promptVar?.default || promptVar?.value || '';
        });
        return initial;
    });

    // Generated prompt with variables replaced
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [copied, setCopied] = useState(false);

    // Generate prompt from template
    useEffect(() => {
        let result = prompt.content;
        Object.entries(variableValues).forEach(([name, value]) => {
            const regex = new RegExp(`\\{\\{${name}\\}\\}`, 'g');
            result = result.replace(regex, value || `{{${name}}}`);
        });
        setGeneratedPrompt(result);
    }, [prompt.content, variableValues]);

    const handleVariableChange = (name: string, value: string) => {
        setVariableValues(prev => ({ ...prev, [name]: value }));
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(generatedPrompt);
            incrementCopyCount(prompt.id); // Incrementa contador no banco
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleEdit = () => {
        onClose();
        onEdit?.();
    };

    const handleDelete = () => {
        if (window.confirm(`Tem certeza que deseja excluir "${prompt.title}"?`)) {
            onClose();
            onDelete?.();
        }
    };

    const allVariablesFilled = promptVariables.every(name => variableValues[name]?.trim());

    return (
        <Modal size="lg" onClose={onClose}>
            <Modal.Header>
                <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-text-primary">{prompt.title}</h2>
                    {prompt.tags && prompt.tags.length > 0 && (
                        <div className="flex gap-1.5 mt-1">
                            {prompt.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="text-[10px] text-text-muted">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    {onEdit && (
                        <button
                            onClick={handleEdit}
                            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
                            title="Editar prompt"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={handleDelete}
                            className="p-1.5 rounded-lg text-text-muted hover:text-error-500 hover:bg-error-500/10 transition-colors"
                            title="Excluir prompt"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors ml-1"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </Modal.Header>

            <Modal.Body className="space-y-5">
                {/* Variables Section */}
                {promptVariables.length > 0 && (
                    <div className="rounded-2xl border border-border-default bg-gradient-to-br from-primary-500/5 to-transparent p-4 space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary-500/10">
                                <Braces className="w-4 h-4 text-primary-500" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-text-primary">
                                    Preencha as variáveis
                                </h3>
                                <p className="text-xs text-text-muted">
                                    {promptVariables.length} {promptVariables.length === 1 ? 'campo' : 'campos'} para personalizar
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {promptVariables.map((name, index) => {
                                const commonVar = findVariable(name);
                                const category = getVariableCategory(name);

                                return (
                                    <div key={name} className="space-y-2">
                                        <label className="flex items-center gap-2">
                                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary-500/20 text-primary-500 text-[10px] font-bold">
                                                {index + 1}
                                            </span>
                                            <code
                                                className="text-xs font-mono px-2 py-0.5 rounded"
                                                style={{
                                                    backgroundColor: category ? `${category.color}15` : '#f9731615',
                                                    color: category?.color || '#f97316',
                                                    border: `1px solid ${category?.color || '#f97316'}30`
                                                }}
                                            >
                                                {`{{${name}}}`}
                                            </code>
                                            {commonVar?.description && (
                                                <span className="text-xs text-text-muted">
                                                    — {commonVar.description}
                                                </span>
                                            )}
                                        </label>

                                        {commonVar?.type === 'select' && commonVar.options ? (
                                            <select
                                                value={variableValues[name] || ''}
                                                onChange={(e) => handleVariableChange(name, e.target.value)}
                                                className="w-full px-4 py-3 text-sm rounded-xl border-2 border-border-default bg-bg-surface text-text-primary focus:outline-none focus:border-primary-500 transition-colors"
                                            >
                                                <option value="">Selecione uma opção...</option>
                                                {commonVar.options.map(opt => (
                                                    <option key={opt.value} value={opt.label}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type="text"
                                                value={variableValues[name] || ''}
                                                onChange={(e) => handleVariableChange(name, e.target.value)}
                                                placeholder={commonVar?.placeholder || `Ex: valor para ${name}`}
                                                className="w-full px-4 py-3 text-sm rounded-xl border-2 border-border-default bg-bg-surface text-text-primary placeholder-text-muted focus:outline-none focus:border-primary-500 transition-colors"
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Preview Section */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-text-secondary">
                            {promptVariables.length > 0 ? 'Resultado' : 'Conteúdo do Prompt'}
                        </h3>
                        <span className="text-xs text-text-muted">
                            {generatedPrompt.length} caracteres
                        </span>
                    </div>
                    <HighlightedPromptEditor
                        value={generatedPrompt}
                        onChange={setGeneratedPrompt}
                        placeholder="O prompt aparecerá aqui..."
                        minHeight="180px"
                        className="bg-bg-elevated/50 rounded-xl"
                    />
                    {!allVariablesFilled && promptVariables.length > 0 && (
                        <p className="text-xs text-primary-500 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                            Preencha todas as variáveis acima
                        </p>
                    )}
                </div>
            </Modal.Body>

            <Modal.Footer>
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center w-full gap-3">
                    {/* Left - Close */}
                    <Button variant="ghost" onClick={onClose} className="order-2 sm:order-1">
                        Fechar
                    </Button>

                    {/* Right - Main Actions */}
                    <div className="flex gap-2 order-1 sm:order-2">
                        <Button
                            onClick={handleCopy}
                            variant="secondary"
                            className="gap-2 flex-1 sm:flex-none"
                            disabled={!generatedPrompt.trim()}
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    Copiado!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    Copiar
                                </>
                            )}
                        </Button>
                        <RunPromptButton
                            content={generatedPrompt}
                            promptId={prompt.id}
                            variant="primary"
                            size="md"
                        />
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    );
}
