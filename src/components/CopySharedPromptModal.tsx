import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SharedPrompt } from '../types';
import { copySharedPrompt } from '../services/api';
import { Modal } from './ui/Modal';
// Assuming toast exists, otherwise I'll comment it out or use console.log
// import { toast } from 'react-hot-toast';

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
            // toast.success('Prompt copiado com sucesso!');
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
                <div className="bg-bg-elevated rounded-lg p-4">
                    <p className="text-sm text-text-muted mb-1">Prompt original:</p>
                    <p className="font-medium text-text-primary">{share.prompt.title}</p>
                </div>

                {/* Novo Título */}
                <div>
                    <label className="label">Título da cópia</label>
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="input-primary w-full"
                        placeholder="Digite um novo título..."
                    />
                </div>

                {/* Categoria Destino */}
                {/* Simplified CategorySelect for now */}
                <div>
                    <label className="label">Salvar na categoria *</label>
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="input-primary w-full"
                    >
                        <option value="">Selecione uma categoria...</option>
                        <option value="cat-geral">Geral</option>
                        {/* In a real app we would map over categories here */}
                    </select>
                </div>

                {/* Opções */}
                <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={includeVariables}
                            onChange={(e) => setIncludeVariables(e.target.checked)}
                            className="rounded"
                        />
                        <span className="text-sm text-text-secondary">
                            Incluir variáveis do prompt original
                        </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={includeTags}
                            onChange={(e) => setIncludeTags(e.target.checked)}
                            className="rounded"
                        />
                        <span className="text-sm text-text-secondary">
                            Incluir tags do prompt original
                        </span>
                    </label>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <button onClick={onClose} className="btn-ghost">Cancelar</button>
                <button
                    onClick={() => copyMutation.mutate()}
                    disabled={!categoryId || !newTitle.trim() || copyMutation.isPending}
                    className="btn-primary"
                >
                    {copyMutation.isPending ? 'Copiando...' : 'Copiar Prompt'}
                </button>
            </Modal.Footer>
        </Modal>
    );
}
