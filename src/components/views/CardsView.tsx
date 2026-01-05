import React, { useState } from 'react';
import { Share2, Pencil, Trash2, Star, Copy, Check } from 'lucide-react';
import { Prompt } from '../../types';
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

// Card individual com estado de cópia
const PromptCard: React.FC<{
    prompt: Prompt;
    onShare: (prompt: Prompt) => void;
    onEdit?: (prompt: Prompt) => void;
    onDelete?: (prompt: Prompt) => void;
    onUse?: (prompt: Prompt) => void;
    onToggleFavorite?: (prompt: Prompt) => void;
    onView?: (prompt: Prompt) => void;
}> = ({ prompt, onShare, onEdit, onDelete, onUse, onToggleFavorite, onView }) => {
    const [copied, setCopied] = useState(false);
    const copyCount = prompt.copy_count || 0;

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(prompt.content);
            setCopied(true);
            onUse && onUse(prompt);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div
            className="group relative rounded-xl bg-bg-surface border border-border-subtle hover:border-primary-500/50 transition-all duration-200 hover:shadow-md cursor-pointer"
            onClick={() => onView && onView(prompt)}
        >
            {/* Favorito - Canto superior direito */}
            <button
                onClick={(e) => { e.stopPropagation(); onToggleFavorite && onToggleFavorite(prompt); }}
                className={clsx(
                    "absolute top-3 right-3 p-1 rounded-full transition-all z-10",
                    prompt.is_favorite
                        ? "text-accent-500"
                        : "text-text-muted opacity-0 group-hover:opacity-100 hover:text-accent-500"
                )}
            >
                <Star className={clsx("w-4 h-4", prompt.is_favorite && "fill-current")} />
            </button>

            {/* Conteúdo */}
            <div className="p-4">
                {/* Título */}
                <h3 className="font-medium text-text-primary line-clamp-1 pr-6 mb-1">
                    {prompt.title}
                </h3>

                {/* Categoria - discreta */}
                <p className="text-xs text-text-muted mb-3">
                    {prompt.category?.name || 'Geral'}
                </p>

                {/* Descrição */}
                <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                    {prompt.content}
                </p>

                {/* Tags - todas visíveis, discretas */}
                {prompt.tags && prompt.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {prompt.tags.map(tag => (
                            <span
                                key={tag}
                                className="text-[10px] text-text-muted bg-bg-elevated/50 px-1.5 py-0.5 rounded"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Footer: Usos + Ação Principal */}
                <div className="flex items-center justify-between pt-3 border-t border-border-subtle/50">
                    {/* Contagem de uso */}
                    <span className="text-xs text-text-muted">
                        {copyCount} {copyCount === 1 ? 'uso' : 'usos'}
                    </span>

                    {/* Ações */}
                    <div className="flex items-center gap-1">
                        {/* Botão Copiar - Ação principal clara */}
                        <button
                            onClick={handleCopy}
                            className={clsx(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                                copied
                                    ? "bg-green-500 text-white"
                                    : "bg-primary-500 text-white hover:bg-primary-600"
                            )}
                        >
                            {copied ? (
                                <>
                                    <Check className="w-3.5 h-3.5" />
                                    Copiado!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-3.5 h-3.5" />
                                    Copiar
                                </>
                            )}
                        </button>

                        {/* Menu secundário - aparece no hover */}
                        <Menu as="div" className="relative">
                            <Menu.Button
                                className="p-1.5 rounded-lg text-text-muted opacity-0 group-hover:opacity-100 hover:text-text-primary hover:bg-bg-hover transition-all"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <circle cx="12" cy="12" r="1" />
                                    <circle cx="12" cy="5" r="1" />
                                    <circle cx="12" cy="19" r="1" />
                                </svg>
                            </Menu.Button>
                            <Transition
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 bottom-full mb-1 w-32 origin-bottom-right rounded-lg bg-bg-elevated border border-border-subtle shadow-lg z-50 py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onEdit && onEdit(prompt); }}
                                                className={clsx(
                                                    "w-full flex items-center gap-2 px-3 py-1.5 text-sm",
                                                    active ? "bg-bg-hover text-text-primary" : "text-text-secondary"
                                                )}
                                            >
                                                <Pencil className="w-3.5 h-3.5" /> Editar
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onShare(prompt); }}
                                                className={clsx(
                                                    "w-full flex items-center gap-2 px-3 py-1.5 text-sm",
                                                    active ? "bg-bg-hover text-text-primary" : "text-text-secondary"
                                                )}
                                            >
                                                <Share2 className="w-3.5 h-3.5" /> Compartilhar
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onDelete && onDelete(prompt); }}
                                                className={clsx(
                                                    "w-full flex items-center gap-2 px-3 py-1.5 text-sm",
                                                    active ? "bg-red-500/10 text-red-400" : "text-text-secondary"
                                                )}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" /> Excluir
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
};

export const CardsView: React.FC<CardsViewProps> = ({ prompts, onShare, onEdit, onDelete, onUse, onToggleFavorite, onView }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prompts.map(prompt => (
                <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    onShare={onShare}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onUse={onUse}
                    onToggleFavorite={onToggleFavorite}
                    onView={onView}
                />
            ))}
        </div>
    );
};
