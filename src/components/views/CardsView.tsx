import React, { useState } from 'react';
import { Share2, Pencil, Trash2, Star, Copy, Check, Zap, MoreHorizontal } from 'lucide-react';
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

// Card individual
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
    const copyCount = (prompt as any).copy_count || 0;

    const handleCopyDirect = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(prompt.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            // Opcional: Notificar o backend do uso sem abrir o modal
            if (onUse) onUse(prompt);
        } catch (err) {
            console.error('Falha ao copiar:', err);
        }
    };

    return (
        <div
            className="group relative flex flex-col h-full rounded-2xl bg-bg-surface border border-transparent transition-all duration-300 hover:border-border-subtle/50 hover:shadow-2xl hover:-translate-y-1 overflow-hidden cursor-pointer"
            onClick={() => onView && onView(prompt)}
        >
            {/* Efeito Visual UAU - Fade de degradê sutil no hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Top Highlight on Hover */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative p-6 flex flex-col h-full z-10">
                {/* Header: Título + Ações Rápidas */}
                <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="flex-1 font-bold text-lg text-text-primary leading-snug tracking-tight group-hover:text-primary-500 transition-colors">
                        {prompt.title}
                    </h3>

                    <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {/* Ações aparecem no hover para ser SUPER clean */}

                        {/* Favoritar */}
                        <button
                            onClick={(e) => { e.stopPropagation(); onToggleFavorite && onToggleFavorite(prompt); }}
                            className={clsx(
                                "p-2 rounded-lg transition-colors",
                                prompt.is_favorite
                                    ? "text-accent-500 bg-accent-500/10"
                                    : "text-text-muted hover:bg-bg-elevated hover:text-text-primary"
                            )}
                        >
                            <Star className={clsx("w-4 h-4", prompt.is_favorite && "fill-current")} />
                        </button>

                        {/* Menu de Opções */}
                        <Menu as="div" className="relative">
                            <Menu.Button
                                className="p-2 rounded-lg text-text-muted hover:bg-bg-elevated hover:text-text-primary transition-colors"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreHorizontal className="w-5 h-5" />
                            </Menu.Button>
                            <Transition
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 top-full mt-2 w-48 origin-top-right rounded-xl bg-bg-elevated border border-border-default shadow-xl z-50 py-1 focus:outline-none backdrop-blur-xl">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onEdit && onEdit(prompt); }}
                                                className={clsx(
                                                    "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
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
                                                    "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
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
                                                    "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                                                    active ? "bg-error-500/10 text-error-500" : "text-text-secondary"
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
                    {/* Se não estiver em hover, mostrar star se favorito */}
                    {!prompt.is_favorite ? null : (
                        <div className="group-hover:hidden text-accent-500">
                            <Star className="w-4 h-4 fill-current" />
                        </div>
                    )}
                </div>

                {/* Conteúdo: Preview do Prompt */}
                <p className="text-text-secondary text-sm leading-relaxed mb-6 line-clamp-3">
                    {prompt.content}
                </p>

                {/* Tags: Estilo Pill (Limpo e reconhecível) */}
                {prompt.tags && prompt.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {prompt.tags.map(tag => (
                            <span
                                key={tag}
                                className="px-3 py-1 rounded-full text-[11px] font-medium bg-bg-elevated text-text-secondary border border-transparent hover:border-border-subtle transition-colors"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Bottom: Uso + Copiar Direto */}
                <div className="mt-auto flex items-center justify-between pt-2 border-t border-border-subtle/20 group-hover:border-border-subtle/50 transition-colors">
                    <div className="flex items-center gap-1.5 text-text-muted py-3">
                        <Zap className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-medium">{copyCount} usos</span>
                    </div>

                    <button
                        onClick={handleCopyDirect}
                        className={clsx(
                            "flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300",
                            copied
                                ? "bg-success-500/10 text-success-500"
                                : "text-text-secondary hover:text-primary-500 hover:bg-primary-500/5"
                        )}
                    >
                        {copied ? (
                            <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Copiado</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copiar</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const CardsView: React.FC<CardsViewProps> = ({ prompts, onShare, onEdit, onDelete, onUse, onToggleFavorite, onView }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
