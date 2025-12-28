import React from 'react';
import { Share2, Play, Pencil, Trash2, Star } from 'lucide-react';
import { Prompt } from '../../types';
import { Button } from '../ui/Button';
import clsx from 'clsx';

interface CardsViewProps {
    prompts: Prompt[];
    onShare: (prompt: Prompt) => void;
    onEdit?: (prompt: Prompt) => void;
    onDelete?: (prompt: Prompt) => void;
    onUse?: (prompt: Prompt) => void;
    onToggleFavorite?: (prompt: Prompt) => void;
}

export const CardsView: React.FC<CardsViewProps> = ({ prompts, onShare, onEdit, onDelete, onUse, onToggleFavorite }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {prompts.map(prompt => (
                <div
                    key={prompt.id}
                    onClick={() => onEdit && onEdit(prompt)}
                    className="bg-bg-surface border border-border-subtle rounded-xl p-4 md:p-5 hover:border-primary-500/50 hover:shadow-lg transition-all group cursor-pointer flex flex-col h-full active:scale-[0.99] relative"
                >
                    {/* Header: Category + Favorite */}
                    <div className="flex justify-between items-start mb-3 gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium bg-primary-500/10 text-primary-500 truncate max-w-[120px] md:max-w-[150px]`}>
                            {prompt.category?.name || 'Geral'}
                        </span>
                        <button
                            onClick={(e) => { e.stopPropagation(); onToggleFavorite && onToggleFavorite(prompt); }}
                            className={clsx(
                                "w-8 h-8 md:w-7 md:h-7 rounded-full flex items-center justify-center transition-all hover:scale-110 border touch-target",
                                prompt.is_favorite
                                    ? "bg-accent-500/20 text-accent-500 border-accent-500/30 hover:bg-accent-500/30"
                                    : "bg-bg-elevated/50 text-text-muted border-transparent hover:bg-bg-elevated hover:text-accent-500 hover:border-accent-500/30"
                            )}
                            title={prompt.is_favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                        >
                            <Star className={clsx("w-4 h-4 md:w-3.5 md:h-3.5", prompt.is_favorite && "fill-current")} />
                        </button>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-text-primary mb-2 line-clamp-1 text-base md:text-base">{prompt.title}</h3>

                    {/* Content Preview */}
                    <p className="text-sm text-text-secondary line-clamp-2 md:line-clamp-3 mb-4 flex-1">{prompt.content}</p>

                    {/* Footer: Tags + Actions */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between mt-auto pt-3 border-t border-border-subtle gap-3 md:gap-2">
                        {/* Tags */}
                        <div className="flex gap-1 overflow-x-auto scrollbar-hide flex-1 pb-1 md:pb-0">
                            {prompt.tags?.slice(0, 3).map(tag => (
                                <span key={tag} className="text-[10px] text-text-muted bg-bg-elevated px-1.5 py-0.5 rounded whitespace-nowrap flex-shrink-0">{tag}</span>
                            ))}
                            {(prompt.tags?.length || 0) > 3 && (
                                <span className="text-[10px] text-text-muted">+{(prompt.tags?.length || 0) - 3}</span>
                            )}
                            {(!prompt.tags || prompt.tags.length === 0) && (
                                <span className="text-[10px] text-text-muted italic">Sem tags</span>
                            )}
                        </div>

                        {/* Action Buttons - Always visible on mobile */}
                        <div className="flex gap-1.5 justify-end">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => { e.stopPropagation(); onUse && onUse(prompt); }}
                                className="h-9 w-9 md:h-7 md:w-7 rounded-lg bg-primary-500/10 text-primary-500 hover:bg-primary-500/20 md:opacity-0 md:group-hover:opacity-100 transition-all"
                                title="Usar Prompt"
                            >
                                <Play className="w-4 h-4 md:w-3.5 md:h-3.5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => { e.stopPropagation(); onShare(prompt); }}
                                className="h-9 w-9 md:h-7 md:w-7 rounded-lg hover:text-primary-500 md:opacity-0 md:group-hover:opacity-100 transition-all"
                                title="Compartilhar"
                            >
                                <Share2 className="w-4 h-4 md:w-3.5 md:h-3.5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => { e.stopPropagation(); onEdit && onEdit(prompt); }}
                                className="h-9 w-9 md:h-7 md:w-7 rounded-lg hover:text-primary-500 md:opacity-0 md:group-hover:opacity-100 transition-all"
                                title="Editar"
                            >
                                <Pencil className="w-4 h-4 md:w-3.5 md:h-3.5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => { e.stopPropagation(); onDelete && onDelete(prompt); }}
                                className="h-9 w-9 md:h-7 md:w-7 rounded-lg hover:text-error-500 hover:bg-error-500/10 md:opacity-0 md:group-hover:opacity-100 transition-all"
                                title="Excluir"
                            >
                                <Trash2 className="w-4 h-4 md:w-3.5 md:h-3.5" />
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
