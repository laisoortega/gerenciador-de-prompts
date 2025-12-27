import React, { useState, useMemo } from 'react';
import { Prompt, Category } from '../../types';
import { Folder, FileText, ChevronRight, ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../ui/Button';

interface FoldersViewProps {
    prompts: Prompt[];
    categories: Category[]; // All categories
    onShare: (prompt: Prompt) => void;
    onEdit?: (prompt: Prompt) => void;
    onDelete?: (prompt: Prompt) => void;
}

// Helper to count all items (prompts + nested prompts) in a category
function getCategoryItemCount(categoryId: string, prompts: Prompt[], allCategories: Category[]): number {
    // Direct prompts in this category
    let count = prompts.filter(p => p.category_id === categoryId).length;
    // Add subcategories' item counts
    const children = allCategories.filter(c => c.parent_id === categoryId);
    for (const child of children) {
        count += getCategoryItemCount(child.id, prompts, allCategories);
    }
    // Also count subcategories themselves as "items" for navigation
    count += children.length;
    return count;
}

export const FoldersView: React.FC<FoldersViewProps> = ({ prompts, categories, onShare, onEdit, onDelete }) => {
    // Start at root (null)
    const [currentPath, setCurrentPath] = useState<Category[]>([]);
    const currentFolder = currentPath.length > 0 ? currentPath[currentPath.length - 1] : null;
    const currentFolderId = currentFolder?.id || null;

    // Filter items for current level (memoized for performance)
    const visibleCategories = useMemo(() =>
        categories.filter(c => c.parent_id === currentFolderId),
        [categories, currentFolderId]
    );

    const visiblePrompts = useMemo(() =>
        prompts.filter(p => {
            if (currentFolderId === null) {
                return !p.category_id; // Show uncategorized at root
            }
            return p.category_id === currentFolderId;
        }),
        [prompts, currentFolderId]
    );

    const handleEnterFolder = (folder: Category) => {
        setCurrentPath([...currentPath, folder]);
    };

    const handleNavigateUp = () => {
        setCurrentPath(currentPath.slice(0, -1));
    };

    const handleBreadcrumbClick = (index: number) => {
        setCurrentPath(currentPath.slice(0, index + 1));
    };

    return (
        <div className="flex flex-col h-full">
            {/* Breadcrumbs & Navigation */}
            <div className="flex items-center gap-2 mb-6 text-sm text-text-secondary">
                <button
                    onClick={() => setCurrentPath([])}
                    className={`hover:text-primary-500 transition-colors ${currentPath.length === 0 ? 'text-text-primary font-semibold' : ''}`}
                >
                    Início
                </button>

                {currentPath.map((folder, index) => (
                    <React.Fragment key={folder.id}>
                        <ChevronRight className="w-4 h-4 text-text-muted" />
                        <button
                            onClick={() => handleBreadcrumbClick(index)}
                            className={`hover:text-primary-500 transition-colors ${index === currentPath.length - 1 ? 'text-text-primary font-semibold' : ''}`}
                        >
                            {folder.name}
                        </button>
                    </React.Fragment>
                ))}
            </div>

            {/* Back Button */}
            {currentPath.length > 0 && (
                <button
                    onClick={handleNavigateUp}
                    className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary mb-4 w-fit"
                >
                    <ArrowLeft className="w-4 h-4" /> Voltar
                </button>
            )}

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {/* Folders */}
                {visibleCategories.map(cat => {
                    const itemCount = getCategoryItemCount(cat.id, prompts, categories);
                    return (
                        <div
                            key={cat.id}
                            onClick={() => handleEnterFolder(cat)}
                            className="bg-bg-surface border border-border-subtle rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:bg-bg-hover hover:border-primary-500/50 transition-all group"
                        >
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center text-base font-bold text-white shadow-sm flex-shrink-0"
                                style={{ backgroundColor: cat.color || '#3b82f6' }}
                            >
                                {cat.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-medium text-text-primary truncate">{cat.name}</h4>
                                <p className="text-xs text-text-muted">{itemCount} itens</p>
                            </div>
                        </div>
                    );
                })}

                {/* Files (Prompts) */}
                {visiblePrompts.map(prompt => (
                    <div
                        key={prompt.id}
                        onClick={() => onEdit?.(prompt)}
                        className="bg-bg-surface border border-border-subtle rounded-lg p-4 flex flex-col cursor-pointer hover:shadow-md hover:border-primary-500/30 transition-all group"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div className="p-2 bg-[#3b82f61a] rounded text-primary-500">
                                <FileText className="w-5 h-5" />
                            </div>
                            {prompt.is_favorite && <span className="text-accent-500 text-xs">★</span>}
                        </div>
                        <h4 className="font-medium text-text-primary text-sm line-clamp-2 mb-1">{prompt.title}</h4>
                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border-subtle/50">
                            <p className="text-[10px] text-text-muted">
                                {format(new Date(prompt.updated_at), 'd MMM')}
                            </p>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => { e.stopPropagation(); onEdit?.(prompt); }}
                                    className="h-6 w-6 hover:text-primary-500"
                                >
                                    <Pencil className="w-3 h-3" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => { e.stopPropagation(); onDelete?.(prompt); }}
                                    className="h-6 w-6 hover:text-error-500"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onShare(prompt); }}
                                    className="p-1 text-text-muted hover:text-primary-500"
                                >
                                    <span className="sr-only">Compartilhar</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" x2="12" y1="2" y2="15" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {visibleCategories.length === 0 && visiblePrompts.length === 0 && (
                    <div className="col-span-full py-12 text-center text-text-muted border border-dashed border-border-subtle rounded-lg">
                        Pasta vazia
                    </div>
                )}
            </div>
        </div>
    );
};
