import { useState } from 'react';
import { Prompt } from '../types';
import { useStore } from '../contexts/StoreContext';
import { Modal } from './ui/Modal';
import { VariableSelector, SelectedVariable, CustomVariable } from './VariableSelector';
import { CommonVariable } from '../types';

interface CreatePromptModalProps {
    onClose: () => void;
}

export function CreatePromptModal({ onClose }: CreatePromptModalProps) {
    const { addPrompt, activeWorkspaceId } = useStore();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedVariables, setSelectedVariables] = useState<SelectedVariable[]>([]);
    const [customVariables, setCustomVariables] = useState<CustomVariable[]>([]);

    const detectPromptCategory = (text: string) => 'copy'; // Placeholder logic

    const handleToggleVariable = (variable: CommonVariable) => {
        if (selectedVariables.some(sv => sv.variable.id === variable.id)) {
            setSelectedVariables(prev => prev.filter(sv => sv.variable.id !== variable.id));
        } else {
            setSelectedVariables(prev => [...prev, { variable, value: '' }]);
        }
    };

    const handleAddCustomVariable = (variable: CustomVariable) => {
        setCustomVariables(prev => [...prev, variable]);
    };

    const handleRemoveCustomVariable = (name: string) => {
        setCustomVariables(prev => prev.filter(cv => cv.name !== name));
    };

    const handleUpdateCustomVariable = (name: string, updates: Partial<CustomVariable>) => {
        setCustomVariables(prev => prev.map(cv => cv.name === name ? { ...cv, ...updates } : cv));
    };

    const handleSave = () => {
        // Construct the prompt content with variables appended if they are not active
        // Ideally we wrap the content with the variable values when using the prompt
        // For now, we save the prompt definition

        // Convert variables to PromptVariable format
        const finalVariables = [
            ...selectedVariables.map(sv => ({
                name: sv.variable.name,
                value: sv.value,
                placeholder: sv.variable.placeholder
            })),
            ...customVariables.map(cv => ({
                name: cv.name,
                default: cv.default_value,
                placeholder: cv.placeholder
            }))
        ];

        addPrompt({
            title,
            content,
            variables: finalVariables,
            tags: [], // TODO: Tag input
            workspace_id: activeWorkspaceId,
            is_favorite: false
        });
        onClose();
    };

    return (
        <Modal size="lg" onClose={onClose}>
            <Modal.Header>
                <h2 className="text-xl font-bold text-text-primary">Criar Novo Prompt</h2>
            </Modal.Header>
            <Modal.Body className="space-y-6">
                <div>
                    <label className="label">Título</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="input-primary w-full"
                        placeholder="Ex: Email de Vendas Frio"
                    />
                </div>
                <div>
                    <label className="label">Conteúdo do Prompt</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="input-primary w-full h-40 font-mono text-sm"
                        placeholder="Escreva seu prompt aqui... Use {{variavel}} para inserir variáveis."
                    />
                </div>

                {/* Seção de Variáveis */}
                <div className="border-t border-border-subtle pt-6">
                    <VariableSelector
                        selectedVariables={selectedVariables}
                        customVariables={customVariables}
                        onToggleVariable={handleToggleVariable}
                        onAddCustomVariable={handleAddCustomVariable}
                        onRemoveCustomVariable={handleRemoveCustomVariable}
                        onUpdateCustomVariable={handleUpdateCustomVariable}
                        suggestedCategory={detectPromptCategory(content) as any}
                    />
                </div>

                {/* Preview das variáveis inseridas automaticamente */}
                {(selectedVariables.length > 0 || customVariables.length > 0) && (
                    <div className="bg-bg-elevated rounded-lg p-4">
                        <p className="text-sm text-text-muted mb-2">
                            💡 As seguintes variáveis serão inseridas no seu prompt:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {selectedVariables.map(({ variable }) => (
                                <code key={variable.id} className="px-2 py-1 bg-[#3b82f633] text-primary-400 rounded text-xs">
                                    {`{{${variable.name}}}`}
                                </code>
                            ))}
                            {customVariables.map((cv) => (
                                <code key={cv.name} className="px-2 py-1 bg-[#f59e0b33] text-accent-400 rounded text-xs">
                                    {`{{${cv.name}}}`}
                                </code>
                            ))}
                        </div>
                    </div>
                )}


            </Modal.Body>
            <Modal.Footer>
                <button onClick={onClose} className="btn-ghost">Cancelar</button>
                <button onClick={handleSave} disabled={!title || !content} className="btn-primary">Salvar Prompt</button>
            </Modal.Footer>
        </Modal>
    );
}
