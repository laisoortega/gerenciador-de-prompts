import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Mail, Link2, Copy, Check, Trash2, ChevronDown, UserPlus, Users } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Prompt, PromptShare } from '../types';
import { fetchPromptShares, sharePrompt, revokeShare, updateSharePermission } from '../services/api';

interface SharePromptModalProps {
    prompt: Prompt;
    onClose: () => void;
}

interface SharePromptInput {
    emails: string[];
    permission: 'view' | 'edit' | 'full';
    message?: string;
}

export function SharePromptModal({ prompt, onClose }: SharePromptModalProps) {
    const [emails, setEmails] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [permission, setPermission] = useState<'view' | 'edit' | 'full'>('view');
    const [message, setMessage] = useState('');
    const [copied, setCopied] = useState(false);

    const queryClient = useQueryClient();

    // Buscar compartilhamentos existentes
    const { data: shares, isLoading } = useQuery({
        queryKey: ['prompt-shares', prompt.id],
        queryFn: () => fetchPromptShares(prompt.id),
    });

    // Mutation para compartilhar
    const shareMutation = useMutation({
        mutationFn: (data: SharePromptInput) => sharePrompt(prompt.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prompt-shares', prompt.id] });
            setEmails([]);
            setInputValue('');
            setMessage('');
        },
    });

    // Mutation para revogar
    const revokeMutation = useMutation({
        mutationFn: (shareId: string) => revokeShare(prompt.id, shareId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prompt-shares', prompt.id] });
        },
    });

    // Mutation para atualizar permissão
    const updatePermissionMutation = useMutation({
        mutationFn: ({ shareId, permission }: { shareId: string; permission: string }) =>
            updateSharePermission(prompt.id, shareId, permission),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prompt-shares', prompt.id] });
        },
    });

    // Adicionar email à lista
    const handleAddEmail = useCallback(() => {
        const email = inputValue.trim().toLowerCase();
        if (email && isValidEmail(email) && !emails.includes(email)) {
            setEmails([...emails, email]);
            setInputValue('');
        }
    }, [inputValue, emails]);

    // Remover email da lista
    const handleRemoveEmail = (email: string) => {
        setEmails(emails.filter(e => e !== email));
    };

    // Enviar compartilhamento
    const handleShare = () => {
        if (emails.length === 0) return;
        shareMutation.mutate({
            emails,
            permission,
            message: message.trim() || undefined,
        });
    };

    // Copiar link de compartilhamento
    const handleCopyLink = async () => {
        const shareLink = `${window.location.origin}/shared/${prompt.id}`;
        await navigator.clipboard.writeText(shareLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const permissionLabels = {
        view: 'Pode visualizar',
        edit: 'Pode editar',
        full: 'Acesso total',
    };

    const permissionDescriptions = {
        view: 'Visualizar e copiar o prompt',
        edit: 'Visualizar, copiar e editar',
        full: 'Editar e compartilhar com outros',
    };

    return (
        <Modal size="lg" onClose={onClose}>
            <Modal.Header>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-500/10 rounded-lg">
                        <Users className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-text-primary">Compartilhar Prompt</h2>
                        <p className="text-sm text-text-muted truncate max-w-md">{prompt.title}</p>
                    </div>
                </div>
            </Modal.Header>

            <Modal.Body className="space-y-6">
                {/* Seção: Adicionar Pessoas */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                        Adicionar pessoas
                    </label>

                    {/* Input de Email */}
                    <div className="flex gap-2 mb-3">
                        <div className="flex-1 relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                            <input
                                type="email"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddEmail();
                                    }
                                    if (e.key === ',' || e.key === ' ') {
                                        e.preventDefault();
                                        handleAddEmail();
                                    }
                                }}
                                placeholder="Digite o email e pressione Enter"
                                className="input-primary w-full pl-10"
                            />
                        </div>
                        <button
                            onClick={handleAddEmail}
                            disabled={!inputValue.trim() || !isValidEmail(inputValue.trim())}
                            className="btn-ghost"
                        >
                            <UserPlus className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Lista de emails adicionados */}
                    {emails.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {emails.map((email) => (
                                <span
                                    key={email}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-bg-elevated rounded-full text-sm"
                                >
                                    {email}
                                    <button
                                        onClick={() => handleRemoveEmail(email)}
                                        className="p-0.5 hover:bg-bg-hover rounded-full"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Permissão */}
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-sm text-text-secondary">Permissão:</span>
                        <div className="flex gap-2">
                            {(['view', 'edit', 'full'] as const).map((perm) => (
                                <button
                                    key={perm}
                                    onClick={() => setPermission(perm)}
                                    className={`
                    px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                    ${permission === perm
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-bg-elevated text-text-secondary hover:bg-bg-hover'
                                        }
                  `}
                                    title={permissionDescriptions[perm]}
                                >
                                    {permissionLabels[perm]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mensagem opcional */}
                    <div className="mb-4">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Adicionar uma mensagem (opcional)"
                            className="input-primary w-full h-20 resize-none text-sm"
                        />
                    </div>

                    {/* Botão Compartilhar */}
                    <button
                        onClick={handleShare}
                        disabled={emails.length === 0 || shareMutation.isPending}
                        className="btn-primary w-full"
                    >
                        {shareMutation.isPending ? (
                            'Compartilhando...'
                        ) : (
                            <>
                                <Mail className="w-4 h-4 mr-2" />
                                Compartilhar com {emails.length} pessoa{emails.length !== 1 ? 's' : ''}
                            </>
                        )}
                    </button>

                    {/* Feedback de sucesso */}
                    {shareMutation.isSuccess && (
                        <p className="text-success-500 text-sm text-center mt-2">
                            ✓ Compartilhado com sucesso!
                        </p>
                    )}
                </div>

                {/* Divisor */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border-subtle"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="px-3 bg-bg-surface text-sm text-text-muted">
                            ou compartilhar via link
                        </span>
                    </div>
                </div>

                {/* Link de Compartilhamento */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={`${window.location.origin}/shared/${prompt.id}`}
                        readOnly
                        className="input-primary flex-1 text-sm bg-bg-elevated"
                    />
                    <button
                        onClick={handleCopyLink}
                        className="btn-ghost"
                    >
                        {copied ? <Check className="w-5 h-5 text-success-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                </div>

                {/* Lista de pessoas com acesso */}
                {shares && shares.length > 0 && (
                    <div>
                        <h3 className="text-sm font-medium text-text-secondary mb-3">
                            Pessoas com acesso ({shares.length})
                        </h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {shares.map((share) => (
                                <div
                                    key={share.id}
                                    className="flex items-center justify-between p-3 bg-bg-elevated rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center">
                                            <span className="text-sm font-medium text-primary-500">
                                                {share.shared_with_user?.name?.[0] || share.shared_with_email[0].toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-text-primary">
                                                {share.shared_with_user?.name || share.shared_with_email}
                                            </p>
                                            {share.shared_with_user && (
                                                <p className="text-xs text-text-muted">{share.shared_with_email}</p>
                                            )}
                                            {share.status === 'pending' && (
                                                <span className="text-xs text-warning-500">Pendente</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* Seletor de Permissão */}
                                        <select
                                            value={share.permission}
                                            onChange={(e) => updatePermissionMutation.mutate({
                                                shareId: share.id,
                                                permission: e.target.value,
                                            })}
                                            className="input-primary text-sm py-1"
                                        >
                                            <option value="view">Visualizar</option>
                                            <option value="edit">Editar</option>
                                            <option value="full">Acesso total</option>
                                        </select>

                                        {/* Botão Remover */}
                                        <button
                                            onClick={() => revokeMutation.mutate(share.id)}
                                            className="p-1.5 text-text-muted hover:text-error-500 hover:bg-error-500/10 rounded"
                                            title="Remover acesso"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
}

// Utilitário
function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
