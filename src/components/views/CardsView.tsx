import React from 'react';
import { Share2, Play, Pencil, Trash2, Star, Copy, MoreHorizontal } from 'lucide-react';
import { Prompt } from '../../types';
import { Button } from '../ui/Button';
import { Menu, Transition } from '@headlessui/react';
import clsx from 'clsx';

interface CardsViewProps {
    prompts: Prompt[];
    onShare: (prompt: Prompt) => void;
    onEdit?: (prompt: Prompt) => void;
    onDelete?: (prompt: Prompt) => void;
    onUse?: (prompt: Prompt) => void;
    onToggleFavorite?: (prompt: Prompt) => void;
    onView?: (prompt: Prompt) => void;
}

export const CardsView: React.FC<CardsViewProps> = ({ prompts, onShare, onEdit, onDelete, onUse, onToggleFavorite, onView }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prompts.map(prompt => {
                const copyCount = prompt.copy_count || 0;

                return (
                    <div
                        key={prompt.id}
                        className="group rounded-xl bg-bg-surface border border-border-subtle hover:border-primary-500/40 transition-all duration-200 hover:shadow-lg flex flex-col"
                    >
                        {/* Conteúdo Principal - Clicável */}
                        <div
                            className="p-4 flex-1 flex flex-col cursor-pointer"
                            onClick={() => onView && onView(prompt)}
                        >
                            {/* Header: Título + Favorito */}
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="font-semibold text-text-primary line-clamp-1 text-base flex-1">
                                    {prompt.title}
                                </h3>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onToggleFavorite && onToggleFavorite(prompt); }}
                                    className={clsx(
                                        "flex-shrink-0 p-1 rounded-md transition-all",
                                        prompt.is_favorite
                                            ? "text-accent-500"
                                            : "text-text-muted hover:text-accent-500"
                                    )}
                                >
                                    <Star className={clsx("w-4 h-4", prompt.is_favorite && "fill-current")} />
                                </button>
                            </div>

                            {/* Categoria */}
                            <p className="text-xs text-text-muted mb-2">
                                {prompt.category?.name || 'Sem categoria'}
                            </p>

                            {/* Descrição */}
                            <p className="text-sm text-text-secondary line-clamp-2 mb-3 flex-1">
                                {prompt.content}
                            </p>

                            {/* Tags - Mostrar todas */}
                            {prompt.tags && prompt.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {prompt.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="text-xs text-text-muted bg-bg-elevated px-2 py-0.5 rounded-md"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer: Stats + Actions */}
                        <div className="px-4 pb-4">
                            <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
                                {/* Contagem de uso */}
                                <div className="flex items-center gap-1.5 text-text-muted">
                                    <Copy className="w-3.5 h-3.5" />
                                    <span className="text-xs font-medium">
                                        {copyCount} {copyCount === 1 ? 'uso' : 'usos'}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1">
                                    {/* Botão Usar */}
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={(e) => { e.stopPropagation(); onUse && onUse(prompt); }}
                                        className="h-7 px-3 text-xs font-medium"
                                    >
                                        <Play className="w-3 h-3 mr-1" />
                                        Usar
                                    </Button>

                                    {/* Menu de ações */}
                                    <Menu as="div" className="relative">
                                        <Menu.Button
                                            className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-hover transition-all"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Menu.Button>
                                        <Transition
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="absolute right-0 bottom-full mb-1 w-36 origin-bottom-right rounded-lg bg-bg-elevated border border-border-subtle shadow-xl z-50 py-1">
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); onEdit && onEdit(prompt); }}
                                                            className={clsx(
                                                                "w-full flex items-center gap-2 px-3 py-2 text-sm",
                                                                active ? "bg-bg-hover text-text-primary" : "text-text-secondary"
                                                            )}
                                                        >
                                                            <Pencil className="w-4 h-4" /> Editar
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); onShare(prompt); }}
                                                            className={clsx(
                                                                "w-full flex items-center gap-2 px-3 py-2 text-sm",
                                                                active ? "bg-bg-hover text-text-primary" : "text-text-secondary"
                                                            )}
                                                        >
                                                            <Share2 className="w-4 h-4" /> Compartilhar
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); onDelete && onDelete(prompt); }}
                                                            className={clsx(
                                                                "w-full flex items-center gap-2 px-3 py-2 text-sm",
                                                                active ? "bg-error-500/10 text-error-400" : "text-text-secondary"
                                                            )}
                                                        >
                                                            <Trash2 className="w-4 h-4" /> Excluir
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
