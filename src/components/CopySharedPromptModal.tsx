import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SharedPrompt } from '../types';
import { copySharedPrompt } from '../services/api';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface CopySharedPromptModalProps {
    share: SharedPrompt;
    onClose: () => void;
}

export function CopySharedPromptModal({ share, onClose }: CopySharedPromptModalProps) {
    const [categoryId, setCategoryId] = useState<string>('');
    const [newTitle, setNewTitle] = useState(share.prompt.title);
    const [includeVariables, setIncludeVariables] = useState(true);
    const [includeTags, setIncludeTags] = useState(true);

    const queryClient = useQueryClient();

    const copyMutation = useMutation({
        mutationFn: () => copySharedPrompt(share.share.id, {
            category_id: categoryId,
            new_title: newTitle !== share.prompt.title ? newTitle : undefined,
            include_variables: includeVariables,
            include_tags: includeTags,
        }),
        onSuccess: (newPrompt) => {
            queryClient.invalidateQueries({ queryKey: ['prompts'] });
            console.log('Prompt copied', newPrompt);
            onClose();
        },
    });

    return (
        <Modal size="md" onClose={onClose}>
            <Modal.Header>
                <h2 className="text-xl font-bold text-text-primary">Copiar para Meu Banco</h2>
            </Modal.Header>

            <Modal.Body className="space-y-6">
                {/* Preview do Prompt */}
                <div className="bg-bg-elevated rounded-xl p-4 border border-border-subtle">
                    <p className="text-sm text-text-muted mb-1">Prompt original:</p>
                    <p className="font-medium text-text-primary">{share.prompt.title}</p>
                </div>

                {/* Novo Título */}
                <Input
                    label="Título da cópia"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Digite um novo título..."
                />

                {/* Categoria Destino */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5 ml-1">
                        Salvar na categoria *
                    </label>
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="flex h-11 w-full rounded-xl border border-border-default bg-bg-surface px-3 py-2.5 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-all"
                    >
                        <option value="">Selecione uma categoria...</option>
                        <option value="cat-geral">Geral</option>
                        {/* In a real app we would map over categories here */}
                    </select>
                </div>

                {/* Opções */}
                <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer p-2 -mx-2 rounded-lg hover:bg-bg-hover transition-colors">
                        <input
                            type="checkbox"
                            checked={includeVariables}
                            onChange={(e) => setIncludeVariables(e.target.checked)}
                            className="w-5 h-5 rounded border-border-default text-primary-500 focus:ring-primary-500 focus:ring-offset-0 bg-bg-surface"
                        />
                        <span className="text-sm text-text-secondary">
                            Incluir variáveis do prompt original
                        </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-2 -mx-2 rounded-lg hover:bg-bg-hover transition-colors">
                        <input
                            type="checkbox"
                            checked={includeTags}
                            onChange={(e) => setIncludeTags(e.target.checked)}
                            className="w-5 h-5 rounded border-border-default text-primary-500 focus:ring-primary-500 focus:ring-offset-0 bg-bg-surface"
                        />
                        <span className="text-sm text-text-secondary">
                            Incluir tags do prompt original
                        </span>
                    </label>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="ghost" onClick={onClose}>
                    Cancelar
                </Button>
                <Button
                    onClick={() => copyMutation.mutate()}
                    disabled={!categoryId || !newTitle.trim() || copyMutation.isPending}
                    isLoading={copyMutation.isPending}
                >
                    Copiar Prompt
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
