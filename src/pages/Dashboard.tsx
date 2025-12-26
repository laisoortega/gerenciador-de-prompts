import React, { useState } from 'react';
import { useStore } from '../contexts/StoreContext';
import { Prompt } from '../types';
import { CreatePromptModal } from '../components/CreatePromptModal';
import { SharePromptModal } from '../components/SharePromptModal';
import { Plus } from 'lucide-react';
import { CardsView } from '../components/views/CardsView';
import { TableView } from '../components/views/TableView';
import { KanbanView } from '../components/views/KanbanView';
import { FoldersView } from '../components/views/FoldersView';

export const Dashboard: React.FC = () => {
    const { prompts, currentView, categories, movePrompt, searchQuery, setCreatePromptModalOpen } = useStore();
    // Local create modal state removed
    const [sharingPrompt, setSharingPrompt] = useState<Prompt | null>(null);

    const filteredPrompts = prompts.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text-primary">Meus Prompts</h2>
                <button
                    onClick={() => setCreatePromptModalOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Novo Prompt
                </button>
            </div>

            {filteredPrompts.length === 0 && prompts.length > 0 ? (
                <div className="text-center py-20">
                    <p className="text-text-muted">Nenhum prompt encontrado para "{searchQuery}"</p>
                </div>
            ) : prompts.length === 0 ? (
                <div className="text-center py-20 bg-bg-surface rounded-xl border border-border-subtle">
                    <h3 className="text-xl font-bold text-text-primary">Nenhum prompt encontrado</h3>
                    <p className="text-text-secondary mt-2 mb-6">Crie seu primeiro prompt para começar a usar o sistema.</p>
                    <button
                        onClick={() => setCreatePromptModalOpen(true)}
                        className="btn-primary"
                    >
                        Criar Primeiro Prompt
                    </button>
                </div>
            ) : (
                <>
                    {currentView === 'cards' && <CardsView prompts={filteredPrompts} onShare={setSharingPrompt} />}
                    {currentView === 'table' && <TableView prompts={filteredPrompts} onShare={setSharingPrompt} />}
                    {currentView === 'kanban' && (
                        <KanbanView
                            prompts={filteredPrompts}
                            categories={categories.filter(c => !c.parent_id)}
                            onMovePrompt={movePrompt}
                        />
                    )}
                    {currentView === 'folders' && (
                        <FoldersView
                            prompts={filteredPrompts}
                            categories={categories}
                            onShare={setSharingPrompt}
                        />
                    )}
                </>
            )}

            {/* Modal de criação movido para AppLayout para ser global */}
            {sharingPrompt && (
                <SharePromptModal prompt={sharingPrompt} onClose={() => setSharingPrompt(null)} />
            )}
        </div>
    );
};
