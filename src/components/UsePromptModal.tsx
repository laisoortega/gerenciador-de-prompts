import { useState, useEffect, useMemo } from 'react';
import { Prompt } from '../types';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Copy, Check, Sparkles, Edit3, ChevronRight } from 'lucide-react';
import { RunPromptButton } from './RunPromptButton';
import { findVariable, getVariableCategory } from '../data/commonVariables';

interface UsePromptModalProps {
    prompt: Prompt;
    onClose: () => void;
}

export function UsePromptModal({ prompt, onClose }: UsePromptModalProps) {
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
            // Try to get default value from prompt variables or from common variables
            const promptVar = prompt.variables?.find(v => v.name === name);
            initial[name] = promptVar?.default || promptVar?.value || '';
        });
        return initial;
    });

    // Generated prompt with variables replaced
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [isEdited, setIsEdited] = useState(false);
    const [copied, setCopied] = useState(false);
    const [mobileTab, setMobileTab] = useState<'variables' | 'preview'>('variables');

    // Generate prompt from template
    useEffect(() => {
        if (!isEdited) {
            let result = prompt.content;
            Object.entries(variableValues).forEach(([name, value]) => {
                const regex = new RegExp(`\\{\\{${name}\\}\\}`, 'g');
                result = result.replace(regex, value || `{{${name}}}`);
            });
            setGeneratedPrompt(result);
        }
    }, [prompt.content, variableValues, isEdited]);

    const handleVariableChange = (name: string, value: string) => {
        setVariableValues(prev => ({ ...prev, [name]: value }));
        setIsEdited(false); // Reset edit mode when changing variables
    };

    const handlePromptEdit = (value: string) => {
        setGeneratedPrompt(value);
        setIsEdited(true);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(generatedPrompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const allVariablesFilled = promptVariables.every(name => variableValues[name]?.trim());
    const filledCount = promptVariables.filter(name => variableValues[name]?.trim()).length;

    // Variables Form Component
    const VariablesForm = () => (
        <div className="space-y-4">
            {promptVariables.length === 0 ? (
                <p className="text-sm text-text-muted py-4 text-center">
                    Este prompt não possui variáveis
                </p>
            ) : (
                promptVariables.map(name => {
                    const commonVar = findVariable(name);
                    const category = getVariableCategory(name);

                    return (
                        <div key={name} className="space-y-1.5">
                            <label className="flex items-center gap-2">
                                <code
                                    className="text-xs font-mono px-1.5 py-0.5 rounded"
                                    style={{
                                        backgroundColor: category ? `${category.color}15` : '#3b82f615',
                                        color: category?.color || '#3b82f6',
                                        border: `1px solid ${category?.color || '#3b82f6'}30`
                                    }}
                                >
                                    {name}
                                </code>
                            </label>

                            {commonVar?.type === 'select' && commonVar.options ? (
                                <select
                                    value={variableValues[name] || ''}
                                    onChange={(e) => handleVariableChange(name, e.target.value)}
                                    className="w-full px-3 py-3 text-sm rounded-xl border border-border-default bg-bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                    <option value="">Selecione...</option>
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
                                    placeholder={commonVar?.placeholder || `Valor para ${name}`}
                                    className="w-full px-3 py-3 text-sm rounded-xl border border-border-default bg-bg-surface text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            )}

                            {commonVar?.description && (
                                <p className="text-[10px] text-text-muted pl-1">
                                    {commonVar.description}
                                </p>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );

    // Preview Component
    const PreviewSection = () => (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-text-muted" />
                    Preview
                    {isEdited && (
                        <span className="text-[10px] bg-accent-500/20 text-accent-500 px-1.5 py-0.5 rounded">
                            editado
                        </span>
                    )}
                </h3>
                <span className="text-xs text-text-muted">
                    {generatedPrompt.length} caracteres
                </span>
            </div>

            <textarea
                value={generatedPrompt}
                onChange={(e) => handlePromptEdit(e.target.value)}
                className="flex-1 w-full p-3 md:p-4 rounded-xl border border-border-default bg-bg-surface text-sm font-mono leading-relaxed text-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 scrollbar-thin min-h-[200px]"
                placeholder="O prompt aparecerá aqui..."
            />

            {!allVariablesFilled && promptVariables.length > 0 && (
                <p className="text-xs text-accent-500 mt-2 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-500"></span>
                    Preencha todas as variáveis para melhor resultado
                </p>
            )}
        </div>
    );

    return (
        <Modal size="xl" onClose={onClose}>
            <Modal.Header>
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary-500/10 text-primary-500">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 className="text-lg font-bold text-text-primary truncate">{prompt.title}</h2>
                        <p className="text-xs text-text-muted">Preencha as variáveis e copie seu prompt</p>
                    </div>
                </div>
            </Modal.Header>

            <Modal.Body className="p-0">
                {/* Mobile Tabs */}
                <div className="md:hidden flex border-b border-border-subtle bg-bg-elevated/50">
                    <button
                        onClick={() => setMobileTab('variables')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${mobileTab === 'variables'
                            ? 'text-primary-500 border-b-2 border-primary-500'
                            : 'text-text-secondary'
                            }`}
                    >
                        Variáveis
                        {promptVariables.length > 0 && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filledCount === promptVariables.length
                                ? 'bg-success-500/20 text-success-500'
                                : 'bg-bg-elevated text-text-muted'
                                }`}>
                                {filledCount}/{promptVariables.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setMobileTab('preview')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${mobileTab === 'preview'
                            ? 'text-primary-500 border-b-2 border-primary-500'
                            : 'text-text-secondary'
                            }`}
                    >
                        Preview
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Mobile Content */}
                <div className="md:hidden p-4 overflow-y-auto scroll-mobile" style={{ height: 'calc(95vh - 200px)' }}>
                    {mobileTab === 'variables' ? (
                        <VariablesForm />
                    ) : (
                        <PreviewSection />
                    )}
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex h-[55vh]">
                    {/* Left: Variable Form */}
                    <div className="w-80 flex-shrink-0 p-5 border-r border-border-subtle overflow-y-auto bg-bg-elevated/30">
                        <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                            Variáveis ({promptVariables.length})
                        </h3>
                        <VariablesForm />
                    </div>

                    {/* Right: Preview */}
                    <div className="flex-1 p-5 flex flex-col min-w-0">
                        <PreviewSection />
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <div className="flex justify-between items-center w-full gap-3">
                    <div className="hidden sm:flex items-center gap-2 text-xs text-text-muted">
                        {prompt.recommended_ai && (
                            <span className="bg-bg-elevated px-2 py-1 rounded-md">
                                IA: {prompt.recommended_ai}
                            </span>
                        )}
                    </div>
                    <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
                        <Button variant="ghost" onClick={onClose} className="flex-1 sm:flex-none">
                            Fechar
                        </Button>
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
                            variant="primary"
                            size="md"
                        />
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    );
}
