import React, { useState } from 'react';
import { useStore } from '../contexts/StoreContext';
import { Prompt } from '../types';
import { usePromptFilters } from '../hooks/usePromptFilters';
import { FilterBar } from '../components/FilterBar';
import { CreatePromptModal } from '../components/CreatePromptModal';
import { SharePromptModal } from '../components/SharePromptModal';
import { UsePromptModal } from '../components/UsePromptModal';
import { CardsView } from '../components/views/CardsView';
import { TableView } from '../components/views/TableView';
import { KanbanView } from '../components/views/KanbanView';
import { FoldersView } from '../components/views/FoldersView';

export const Dashboard: React.FC = () => {
    const {
        prompts, currentView, categories, movePrompt, deletePrompt, toggleFavorite,
        searchQuery, setSearchQuery, isCreatePromptModalOpen, setCreatePromptModalOpen,
        selectedCategoryId, setSelectedCategoryId,
        onlyFavorites, setOnlyFavorites
    } = useStore();

    const [sharingPrompt, setSharingPrompt] = useState<Prompt | null>(null);
    const [editingPrompt, setEditingPrompt] = useState<Prompt | undefined>(undefined);
    const [usingPrompt, setUsingPrompt] = useState<Prompt | null>(null);

    // Local filter state for advanced filters
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [recommendedAi, setRecommendedAi] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'az' | 'za'>('newest');

    // Pass state to hook
    const { filteredPrompts, availableTags } = usePromptFilters(prompts, {
        searchQuery,
        categoryId: selectedCategoryId,
        categories, // Pass all categories for subcategory filtering
        tags: selectedTags,
        onlyFavorites,
        recommendedAi
    });

    // Sort filtered prompts based on sortBy state
    const sortedPrompts = [...filteredPrompts].sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            case 'oldest':
                return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            case 'az':
                return a.title.localeCompare(b.title);
            case 'za':
                return b.title.localeCompare(a.title);
            default:
                return 0;
        }
    });

    // Handler for FilterBar
    const handleFilterChange = (key: string, value: any) => {
        if (key === 'category_id') setSelectedCategoryId(value);
        if (key === 'tags') setSelectedTags(value);
        if (key === 'only_favorites') setOnlyFavorites(value);
        if (key === 'recommended_ai') setRecommendedAi(value);
        if (key === 'sort_by') setSortBy(value);
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedCategoryId(null);
        setSelectedTags([]);
        setOnlyFavorites(false);
        setRecommendedAi(null);
        setSortBy('newest');
    };

    // Filter state object for FilterBar
    const filters = {
        category_id: selectedCategoryId,
        tags: selectedTags,
        only_favorites: onlyFavorites,
        sort_by: sortBy,
        recommended_ai: recommendedAi
    };

    const handleEditPrompt = (prompt: Prompt) => {
        setEditingPrompt(prompt);
        setCreatePromptModalOpen(true);
    };

    const handleDeletePrompt = (prompt: Prompt) => {
        if (window.confirm(`Tem certeza que deseja excluir "${prompt.title}"?`)) {
            deletePrompt(prompt.id);
        }
    };

    const handleCloseCreateModal = () => {
        setCreatePromptModalOpen(false);
        setEditingPrompt(undefined);
    };

    return (
        <div className="animate-fadeIn pb-24 md:pb-8"> {/* Added padding bottom for mobile fab space */}

            {/* Header Mobile / Title Section */}
            <div className="md:hidden flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-text-primary">Meus Prompts</h2>
            </div>

            <FilterBar
                filters={filters}
                availableTags={availableTags}
                onFilterChange={handleFilterChange}
                onClear={handleClearFilters}
            />

            {sortedPrompts.length === 0 && prompts.length > 0 ? (
                <div className="text-center py-20">
                    <p className="text-text-muted">Nenhum prompt encontrado com os filtros aplicados.</p>
                </div>
            ) : prompts.length === 0 ? (
                <div className="text-center py-20 bg-bg-surface rounded-xl border border-border-subtle">
                    <h3 className="text-xl font-bold text-text-primary">Nenhum prompt encontrado</h3>
                    <p className="text-text-secondary mt-2 mb-6">Crie seu primeiro prompt para começar a usar o sistema.</p>
                    <button
                        onClick={() => { setEditingPrompt(undefined); setCreatePromptModalOpen(true); }}
                        className="btn-primary"
                    >
                        Criar Primeiro Prompt
                    </button>
                </div>
            ) : (
                <>
                    {currentView === 'cards' && (
                        <CardsView
                            prompts={sortedPrompts}
                            onShare={setSharingPrompt}
                            onEdit={handleEditPrompt}
                            onDelete={handleDeletePrompt}
                            onUse={setUsingPrompt}
                            onToggleFavorite={(p) => toggleFavorite(p.id)}
                        />
                    )}
                    {currentView === 'table' && (
                        <TableView
                            prompts={sortedPrompts}
                            onShare={setSharingPrompt}
                            onEdit={handleEditPrompt}
                            onDelete={handleDeletePrompt}
                        />
                    )}
                    {currentView === 'kanban' && (
                        <KanbanView
                            prompts={sortedPrompts}
                            categories={categories}
                            onMovePrompt={movePrompt}
                            onEdit={handleEditPrompt}
                            onDelete={handleDeletePrompt}
                            onCreatePrompt={(categoryId) => {
                                setEditingPrompt(undefined);
                                // TODO: Pass categoryId to modal - for now just open modal
                                setCreatePromptModalOpen(true);
                            }}
                        />
                    )}
                    {currentView === 'folders' && (
                        <FoldersView
                            prompts={sortedPrompts}
                            categories={categories}
                            onShare={setSharingPrompt}
                            onEdit={handleEditPrompt}
                            onDelete={handleDeletePrompt}
                        />
                    )}
                </>
            )}

            {/* Modal de criação/edição */}
            {isCreatePromptModalOpen && (
                <CreatePromptModal
                    key={editingPrompt ? editingPrompt.id : 'create'}
                    onClose={handleCloseCreateModal}
                    initialData={editingPrompt}
                />
            )}

            {/* Modal de compartilhamento */}
            {sharingPrompt && (
                <SharePromptModal prompt={sharingPrompt} onClose={() => setSharingPrompt(null)} />
            )}

            {/* Modal de uso do prompt */}
            {usingPrompt && (
                <UsePromptModal prompt={usingPrompt} onClose={() => setUsingPrompt(null)} />
            )}
        </div>
    );
};
