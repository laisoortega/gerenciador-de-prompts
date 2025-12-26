import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Loader, Share2, Check, Eye, FolderInput } from 'lucide-react';
import { fetchSharedWithMe, respondToShare } from '../services/api';
import { SharedPrompt, Prompt } from '../types';
import { CopySharedPromptModal } from '../components/CopySharedPromptModal';

export default function SharedWithMePage() {
    const [activeTab, setActiveTab] = useState<'active' | 'pending'>('active');
    const [search, setSearch] = useState('');
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['shared-with-me', activeTab, search],
        queryFn: () => fetchSharedWithMe({ status: activeTab, search }),
    });

    const respondMutation = useMutation({
        mutationFn: ({ shareId, action }: { shareId: string; action: 'accept' | 'decline' }) =>
            respondToShare(shareId, action),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shared-with-me'] });
        },
    });

    const [copyModal, setCopyModal] = useState<{ share: SharedPrompt } | null>(null);

    const openPromptPreview = (prompt: Prompt) => {
        // Implement preview logic or reuse existing PromptModal in readonly mode
        console.log('Preview', prompt);
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-text-primary">Compartilhados Comigo</h1>
                <p className="text-text-secondary">Prompts que outras pessoas compartilharam com você</p>
            </div>

            {/* Tabs e Busca */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex bg-bg-surface rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'active'
                            ? 'bg-bg-elevated text-text-primary'
                            : 'text-text-secondary hover:text-text-primary'
                            }`}
                    >
                        Ativos
                        {data?.activeCount !== undefined && data.activeCount > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-[#3b82f633] text-primary-500 rounded-full text-xs">
                                {data.activeCount}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'pending'
                            ? 'bg-bg-elevated text-text-primary'
                            : 'text-text-secondary hover:text-text-primary'
                            }`}
                    >
                        Pendentes
                        {data?.pendingCount !== undefined && data.pendingCount > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-warning-500/20 text-warning-500 rounded-full text-xs">
                                {data.pendingCount}
                            </span>
                        )}
                    </button>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar prompts compartilhados..."
                        className="input-primary pl-10 w-64"
                    />
                </div>
            </div>

            {/* Lista de Prompts */}
            {isLoading ? (
                <div className="text-center py-12">
                    <Loader className="w-8 h-8 animate-spin mx-auto text-primary-500" />
                </div>
            ) : data?.prompts?.length === 0 ? (
                <div className="text-center py-16 bg-bg-surface rounded-xl border border-border-subtle">
                    <Share2 className="w-12 h-12 text-text-muted mx-auto mb-4" />
                    <p className="text-text-secondary mb-2">
                        {activeTab === 'active'
                            ? 'Nenhum prompt compartilhado com você ainda'
                            : 'Nenhum compartilhamento pendente'}
                    </p>
                    <p className="text-text-muted text-sm">
                        Quando alguém compartilhar um prompt com você, ele aparecerá aqui.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {data?.prompts.map((item) => (
                        <SharedPromptCard
                            key={item.share.id}
                            item={item}
                            onAccept={() => respondMutation.mutate({ shareId: item.share.id, action: 'accept' })}
                            onDecline={() => respondMutation.mutate({ shareId: item.share.id, action: 'decline' })}
                            onCopy={() => setCopyModal({ share: item })}
                            onView={() => openPromptPreview(item.prompt)}
                        />
                    ))}
                </div>
            )}

            {/* Modal de Copiar para Meu Banco */}
            {copyModal && (
                <CopySharedPromptModal
                    share={copyModal.share}
                    onClose={() => setCopyModal(null)}
                />
            )}
        </div>
    );
}

// Card de Prompt Compartilhado
function SharedPromptCard({ item, onAccept, onDecline, onCopy, onView }: any) {
    const { prompt, share, shared_by } = item;
    const isPending = share.status === 'pending';

    const generateAvatarUrl = (name: string) => `https://ui-avatars.com/api/?name=${name}&background=random`;
    const formatRelativeDate = (date: string) => {
        return new Date(date).toLocaleDateString(); // Simplified for now
    };

    return (
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-6 hover:border-border-default transition-colors">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    {/* Cabeçalho */}
                    <div className="flex items-center gap-3 mb-3">
                        <img
                            src={shared_by.avatar_url || generateAvatarUrl(shared_by.name)}
                            className="w-10 h-10 rounded-full"
                            alt={shared_by.name}
                        />
                        <div>
                            <p className="text-sm text-text-secondary">
                                <span className="font-medium text-text-primary">{shared_by.name}</span>
                                {' '}compartilhou com você
                            </p>
                            <p className="text-xs text-text-muted">
                                {formatRelativeDate(share.created_at)}
                                {share.permission === 'view' && ' • Somente visualização'}
                                {share.permission === 'edit' && ' • Pode editar'}
                                {share.permission === 'full' && ' • Acesso total'}
                            </p>
                        </div>
                    </div>

                    {/* Título e descrição do prompt */}
                    <h3 className="text-lg font-semibold text-text-primary mb-1">
                        {prompt.title}
                    </h3>
                    {prompt.description && (
                        <p className="text-text-secondary text-sm mb-3 line-clamp-2">
                            {prompt.description}
                        </p>
                    )}

                    {/* Tags */}
                    {prompt.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                            {prompt.tags.slice(0, 5).map((tag: string) => (
                                <span key={tag} className="px-2 py-0.5 bg-bg-elevated rounded text-xs text-text-muted">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Mensagem do remetente */}
                    {share.message && (
                        <div className="bg-bg-elevated rounded-lg p-3 mt-3">
                            <p className="text-sm text-text-secondary italic">"{share.message}"</p>
                        </div>
                    )}
                </div>

                {/* Ações */}
                <div className="flex flex-col items-end gap-2 ml-4">
                    {isPending ? (
                        <>
                            <button onClick={onAccept} className="btn-primary text-sm flex items-center">
                                <Check className="w-4 h-4 mr-1" />
                                Aceitar
                            </button>
                            <button onClick={onDecline} className="btn-ghost text-sm text-error-500">
                                Recusar
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={onView} className="btn-ghost text-sm flex items-center">
                                <Eye className="w-4 h-4 mr-1" />
                                Visualizar
                            </button>
                            <button onClick={onCopy} className="btn-primary text-sm flex items-center">
                                <FolderInput className="w-4 h-4 mr-1" />
                                Copiar
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
