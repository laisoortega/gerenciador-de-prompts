import React, { useState } from 'react';
import { useStore } from '../contexts/StoreContext';
import { Prompt } from '../types';
import { CreatePromptModal } from '../components/CreatePromptModal';
import { SharePromptModal } from '../components/SharePromptModal';
import { Plus, Share2, Copy } from 'lucide-react';

// Placeholder Views
const CardsView = ({ prompts, onShare }: { prompts: Prompt[]; onShare: (prompt: Prompt) => void }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {prompts.map(prompt => (
            <div key={prompt.id} className="bg-bg-surface border border-border-subtle rounded-xl p-5 hover:border-primary-500/50 hover:shadow-glow transition-all group cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium bg-primary-500/10 text-primary-500`}>
                        {prompt.category_id || 'Geral'}
                    </span>
                    {prompt.is_favorite && <span className="text-accent-500">★</span>}
                </div>
                <h3 className="font-semibold text-text-primary mb-2 line-clamp-1">{prompt.title}</h3>
                <p className="text-sm text-text-secondary line-clamp-3 mb-4">{prompt.content}</p>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-border-subtle">
                    <div className="flex gap-1">
                        {prompt.tags.map(tag => (
                            <span key={tag} className="text-[10px] text-text-muted bg-bg-elevated px-1.5 py-0.5 rounded">{tag}</span>
                        ))}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={(e) => { e.stopPropagation(); onShare(prompt); }}
                            className="text-xs font-medium text-text-secondary hover:text-primary-500 flex items-center gap-1"
                            title="Compartilhar"
                        >
                            <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                            className="text-xs font-medium text-text-secondary hover:text-primary-500 flex items-center gap-1"
                            title="Copiar"
                        >
                            <Copy className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const EmptyView = ({ name }: { name: string }) => (
    <div className="flex flex-col items-center justify-center h-96 text-text-muted">
        <p>Visualização {name} em desenvolvimento...</p>
    </div>
);

export const Dashboard: React.FC = () => {
    const { prompts, currentView } = useStore();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [sharingPrompt, setSharingPrompt] = useState<Prompt | null>(null);

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text-primary">Meus Prompts</h2>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Novo Prompt
                </button>
            </div>

            {prompts.length === 0 ? (
                <div className="text-center py-20 bg-bg-surface rounded-xl border border-border-subtle">
                    <h3 className="text-xl font-bold text-text-primary">Nenhum prompt encontrado</h3>
                    <p className="text-text-secondary mt-2 mb-6">Crie seu primeiro prompt para começar a usar o sistema.</p>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="btn-primary"
                    >
                        Criar Primeiro Prompt
                    </button>
                </div>
            ) : (
                <>
                    {currentView === 'cards' && <CardsView prompts={prompts} onShare={setSharingPrompt} />}
                    {currentView === 'table' && <EmptyView name="Tabela" />}
                    {currentView === 'kanban' && <EmptyView name="Kanban" />}
                    {currentView === 'folders' && <EmptyView name="Pastas" />}
                </>
            )}

            {isCreateModalOpen && (
                <CreatePromptModal onClose={() => setIsCreateModalOpen(false)} />
            )}

            {sharingPrompt && (
                <SharePromptModal prompt={sharingPrompt} onClose={() => setSharingPrompt(null)} />
            )}
        </>
    );
};
