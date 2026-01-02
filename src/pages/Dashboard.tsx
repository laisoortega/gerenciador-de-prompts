import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../contexts/StoreContext';
import { Prompt } from '../types';
import { usePlanLimits } from '../hooks/usePlanLimits';
import { FilterBar } from '../components/FilterBar';
import { CreatePromptModal } from '../components/CreatePromptModal';
import { SharePromptModal } from '../components/SharePromptModal';
import { UsePromptModal } from '../components/UsePromptModal';
import { ViewPromptModal } from '../components/ViewPromptModal';
import { UpgradePlanModal } from '../components/UpgradePlanModal';
import { CardsView } from '../components/views/CardsView';

export const Dashboard: React.FC = () => {
    const {
        prompts, deletePrompt, toggleFavorite, updatePrompt,
        searchQuery, setSearchQuery, isCreatePromptModalOpen, setCreatePromptModalOpen,
        selectedTag, setSelectedTag,
    } = useStore();

    const { canCreatePrompt, usage, limits, usagePercentage } = usePlanLimits();

    const [sharingPrompt, setSharingPrompt] = useState<Prompt | null>(null);
    const [editingPrompt, setEditingPrompt] = useState<Prompt | undefined>(undefined);
    const [usingPrompt, setUsingPrompt] = useState<Prompt | null>(null);
    const [viewingPrompt, setViewingPrompt] = useState<Prompt | null>(null);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    // Use selectedTag from store as the filter (synced with TagsPage navigation)
    const selectedCategory = selectedTag;
    const setSelectedCategory = setSelectedTag;
    const [onlyFavorites, setOnlyFavorites] = useState(false);

    // Derive unique tags from prompts (from the tags array field)
    const uniqueCategories = useMemo(() => {
        const allTags: string[] = [];
        prompts.forEach(p => {
            // Tags podem estar no campo tags (array) ou como string separada por vírgula
            if (Array.isArray(p.tags)) {
                allTags.push(...p.tags);
            } else if (typeof p.tags === 'string' && p.tags) {
                allTags.push(...p.tags.split(',').map(t => t.trim()).filter(t => t));
            }
        });
        return [...new Set(allTags)].sort();
    }, [prompts]);

    // Filter prompts
    const filteredPrompts = useMemo(() => {
        return prompts.filter(p => {
            // Search filter (search in title, content, and tags)
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const matchTitle = p.title.toLowerCase().includes(q);
                const matchContent = p.content.toLowerCase().includes(q);
                const promptTags = Array.isArray(p.tags) ? p.tags : [];
                const matchTags = promptTags.some(tag => tag.toLowerCase().includes(q));
                if (!matchTitle && !matchContent && !matchTags) {
                    return false;
                }
            }
            // Tag filter
            if (selectedCategory) {
                const promptTags = Array.isArray(p.tags) ? p.tags : [];
                if (!promptTags.includes(selectedCategory)) {
                    return false;
                }
            }
            // Favorites filter
            if (onlyFavorites && !p.is_favorite) {
                return false;
            }
            return true;
        });
    }, [prompts, searchQuery, selectedCategory, onlyFavorites]);

    // Sort by newest
    const sortedPrompts = [...filteredPrompts].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Handler for FilterBar
    const handleFilterChange = (key: string, value: any) => {
        if (key === 'category') setSelectedCategory(value);
        if (key === 'only_favorites') setOnlyFavorites(value);
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedCategory(null);
        setOnlyFavorites(false);
    };

    // Filter state for FilterBar
    const filters = {
        category: selectedCategory,
        only_favorites: onlyFavorites,
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

    // Verifica limite antes de criar prompt
    const handleCreatePrompt = () => {
        if (!canCreatePrompt) {
            setShowUpgradeModal(true);
            return;
        }
        setEditingPrompt(undefined);
        setCreatePromptModalOpen(true);
    };

    return (
        <div className="animate-fadeIn pb-24 md:pb-8">
            {/* Search Bar */}
            <div className="mb-4">
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar prompts..."
                        className="w-full h-12 pl-12 pr-4 rounded-xl border border-border-default bg-bg-surface text-text-primary placeholder-text-muted focus:outline-none focus:border-primary-500"
                    />
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            <FilterBar
                filters={filters}
                categories={uniqueCategories}
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
                        onClick={() => handleCreatePrompt()}
                        className="btn-primary"
                    >
                        Criar Primeiro Prompt
                    </button>
                </div>
            ) : (
                <CardsView
                    prompts={sortedPrompts}
                    onShare={setSharingPrompt}
                    onEdit={handleEditPrompt}
                    onDelete={handleDeletePrompt}
                    onUse={setUsingPrompt}
                    onToggleFavorite={(p) => toggleFavorite(p.id)}
                    onView={setViewingPrompt}
                    onTagClick={(tag) => setSelectedCategory(tag)}
                    onBulkDelete={(ids) => ids.forEach(id => deletePrompt(id))}
                    onBulkAddTag={(ids, tag) => {
                        ids.forEach(id => {
                            const prompt = prompts.find(p => p.id === id);
                            if (prompt) {
                                const currentTags = Array.isArray(prompt.tags) ? prompt.tags : [];
                                if (!currentTags.includes(tag)) {
                                    updatePrompt(id, { tags: [...currentTags, tag] });
                                }
                            }
                        });
                    }}
                    onBulkRemoveTag={(ids, tag) => {
                        ids.forEach(id => {
                            const prompt = prompts.find(p => p.id === id);
                            if (prompt) {
                                const currentTags = Array.isArray(prompt.tags) ? prompt.tags : [];
                                updatePrompt(id, { tags: currentTags.filter(t => t !== tag) });
                            }
                        });
                    }}
                />
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
                <UsePromptModal
                    prompt={usingPrompt}
                    onClose={() => setUsingPrompt(null)}
                    onEdit={() => {
                        setUsingPrompt(null);
                        handleEditPrompt(usingPrompt);
                    }}
                    onDelete={() => {
                        setUsingPrompt(null);
                        deletePrompt(usingPrompt.id);
                    }}
                />
            )}

            {/* Modal de upgrade quando limite atingido */}
            {showUpgradeModal && (
                <UpgradePlanModal
                    onClose={() => setShowUpgradeModal(false)}
                    limitType="prompts"
                    currentUsage={usage.promptCount}
                    currentLimit={limits.maxPrompts}
                />
            )}

            {/* Modal de visualização do prompt */}
            {viewingPrompt && (
                <ViewPromptModal
                    prompt={viewingPrompt}
                    onClose={() => setViewingPrompt(null)}
                    onEdit={() => {
                        setViewingPrompt(null);
                        handleEditPrompt(viewingPrompt);
                    }}
                    onShare={() => {
                        setViewingPrompt(null);
                        setSharingPrompt(viewingPrompt);
                    }}
                    onDelete={() => {
                        setViewingPrompt(null);
                        handleDeletePrompt(viewingPrompt);
                    }}
                    onUse={() => {
                        setViewingPrompt(null);
                        setUsingPrompt(viewingPrompt);
                    }}
                    onToggleFavorite={() => {
                        toggleFavorite(viewingPrompt.id);
                    }}
                />
            )}
        </div>
    );
};
