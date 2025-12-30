import { useState, useEffect, useRef } from 'react';
import { Prompt } from '../types';
import { useStore } from '../contexts/StoreContext';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { VariableLibrary } from './VariableLibrary';
import { ChevronLeft, ChevronRight, Braces } from 'lucide-react';

export function CreatePromptModal({ onClose, initialData }: { onClose: () => void; initialData?: Prompt }) {
    const { addPrompt, updatePrompt, activeWorkspaceId, categories, selectedCategoryId, preSelectedCategoryForModal } = useStore();
    const [title, setTitle] = useState(initialData?.title || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(', ') || '');
    const [recommendedAi, setRecommendedAi] = useState(initialData?.recommended_ai || 'gpt-4');
    const [categoryId, setCategoryId] = useState<string | null>(initialData?.category_id || preSelectedCategoryForModal || selectedCategoryId || null);
    const [detectedVariables, setDetectedVariables] = useState<{ name: string, default?: string }[]>([]);
    const [showLibrary, setShowLibrary] = useState(false);
    const [mobileTab, setMobileTab] = useState<'form' | 'variables'>('form');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setContent(initialData.content);
            setTagsInput(initialData.tags?.join(', ') || '');
            setRecommendedAi(initialData.recommended_ai || 'gpt-4');
            if (initialData.variables) {
                setDetectedVariables(initialData.variables.map(v => ({ name: v.name, default: v.default || v.value })));
            }
        } else {
            setTitle('');
            setContent('');
            setTagsInput('');
            setRecommendedAi('gpt-4');
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

        setMobileTab('form');
    };

    const handleSave = () => {
        const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

        const finalVariables = detectedVariables.map(v => ({
            name: v.name,
            default: v.default,
            category: 'custom'
        }));

        const promptData = {
            title,
            content,
            variables: finalVariables,
            tags,
            recommended_ai: recommendedAi,
            category_id: categoryId,
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

    // Render form content inline (not as a component to avoid focus loss)
    const formContent = (
        <div className="space-y-4 md:space-y-5">
            <Input
                label="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Email de Vendas Frio"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5 ml-1">Categoria</label>
                    <select
                        value={categoryId || ''}
                        onChange={(e) => setCategoryId(e.target.value || null)}
                        className="flex h-10 md:h-10 w-full rounded-xl border border-border-default bg-bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-all"
                    >
                        <option value="">Sem Categoria</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5 ml-1">IA Recomendada</label>
                    <select
                        value={recommendedAi}
                        onChange={(e) => setRecommendedAi(e.target.value)}
                        className="flex h-10 md:h-10 w-full rounded-xl border border-border-default bg-bg-surface px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-all"
                    >
                        <option value="gpt-4">GPT-4</option>
                        <option value="gpt-3.5">GPT-3.5</option>
                        <option value="claude-3-opus">Claude 3 Opus</option>
                        <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                        <option value="gemini-pro">Gemini Pro</option>
                        <option value="midjourney">Midjourney</option>
                    </select>
                </div>
            </div>
            <Input
                label="Tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="vendas, email, marketing"
            />

            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5 ml-1">
                    Conteúdo do Prompt
                </label>
                <div className="relative">
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="flex min-h-[140px] md:min-h-[180px] w-full rounded-xl border border-border-default bg-bg-surface px-3 py-2 text-sm font-mono leading-relaxed placeholder:text-text-disabled focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-all text-text-primary resize-y"
                        placeholder="Escreva seu prompt aqui... Use {{variavel}} para inserir variáveis."
                        spellCheck={false}
                    />
                </div>
            </div>

            {/* Detected Variables Section */}
            {detectedVariables.length > 0 && (
                <div className="bg-gradient-to-br from-bg-elevated to-bg-surface rounded-xl p-3 md:p-4 border border-border-default shadow-sm">
                    <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                        {detectedVariables.length} Variáveis Detectadas
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                        {detectedVariables.map((variable, idx) => (
                            <div key={variable.name} className="flex items-center gap-2 md:gap-3 bg-bg-surface p-2 md:p-2.5 rounded-lg border border-border-subtle hover:border-primary-500/30 transition-colors">
                                <code className="text-xs font-mono text-primary-500 bg-primary-500/10 px-1.5 py-0.5 rounded-md border border-primary-500/20 whitespace-nowrap flex-shrink-0">
                                    {`{{${variable.name}}}`}
                                </code>
                                <input
                                    type="text"
                                    placeholder="Valor padrão"
                                    className="flex-1 bg-transparent text-sm border-none focus:ring-0 p-0 text-text-primary placeholder-text-muted min-w-0"
                                    value={variable.default || ''}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setDetectedVariables(prev => prev.map(p => p.name === variable.name ? { ...p, default: val } : p));
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <Modal size="xl" onClose={onClose}>
            <Modal.Header>
                <div className="flex items-center justify-between w-full pr-8">
                    <h2 className="text-lg md:text-xl font-bold text-text-primary">
                        {initialData ? 'Editar Prompt' : 'Criar Novo Prompt'}
                    </h2>
                    {/* Desktop toggle */}
                    <button
                        onClick={() => setShowLibrary(!showLibrary)}
                        className="hidden md:flex items-center gap-1 text-xs text-text-muted hover:text-primary-500 transition-colors"
                    >
                        {showLibrary ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                        {showLibrary ? 'Ocultar' : 'Mostrar'} Variáveis
                    </button>
                </div>
            </Modal.Header>

            <Modal.Body className="p-0">
                {/* Mobile Tabs */}
                <div className="md:hidden flex border-b border-border-subtle bg-bg-elevated/50">
                    <button
                        onClick={() => setMobileTab('form')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${mobileTab === 'form'
                            ? 'text-primary-500 border-b-2 border-primary-500'
                            : 'text-text-secondary'
                            }`}
                    >
                        Formulário
                    </button>
                    <button
                        onClick={() => setMobileTab('variables')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${mobileTab === 'variables'
                            ? 'text-primary-500 border-b-2 border-primary-500'
                            : 'text-text-secondary'
                            }`}
                    >
                        <Braces className="w-4 h-4" />
                        Variáveis
                    </button>
                </div>

                {/* Mobile Content */}
                <div className="md:hidden">
                    {mobileTab === 'form' ? (
                        <div className="p-4 overflow-y-auto scroll-mobile">
                            {formContent}
                        </div>
                    ) : (
                        <div className="h-[50vh] overflow-y-auto scroll-mobile">
                            <VariableLibrary onInsertVariable={handleInsertVariable} />
                        </div>
                    )}
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex h-[60vh]">
                    {/* Main Form */}
                    <div className={`flex-1 p-6 overflow-y-auto ${showLibrary ? 'border-r border-border-subtle' : ''}`}>
                        {formContent}
                    </div>

                    {/* Variable Library Sidebar */}
                    {showLibrary && (
                        <div className="w-72 bg-bg-elevated/50 border-l border-border-subtle flex-shrink-0">
                            <VariableLibrary onInsertVariable={handleInsertVariable} />
                        </div>
                    )}
                </div>
            </Modal.Body>

            <Modal.Footer>
                <div className="flex justify-between items-center w-full">
                    <span className="text-xs text-text-muted hidden sm:block">
                        {detectedVariables.length > 0 && `${detectedVariables.length} variáveis · `}
                        {content.length} caracteres
                    </span>
                    <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
                        <Button variant="ghost" onClick={onClose} className="flex-1 sm:flex-none">Cancelar</Button>
                        <Button onClick={handleSave} disabled={!title || !content} className="flex-1 sm:flex-none">
                            {initialData ? 'Salvar' : 'Criar Prompt'}
                        </Button>
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    );
}
