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
            className="group relative flex flex-col h-full rounded-2xl bg-bg-surface border border-border-subtle/50 transition-all duration-500 hover:border-primary-500/30 overflow-hidden cursor-pointer"
            onClick={() => onView && onView(prompt)}
        >
            {/* EFEITO UAU: Background Glow que segue o card */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* EFEITO UAU: Borda interna brilhante sutil no topo */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative p-6 flex flex-col h-full z-10 transition-transform duration-500 group-hover:translate-y-[-2px]">
                {/* Header: Título + Ações */}
                <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="flex-1 font-bold text-lg text-text-primary leading-snug tracking-tight">
                        {prompt.title}
                    </h3>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                        {/* Favorito sempre visível mas sutil */}
                        <button
                            onClick={(e) => { e.stopPropagation(); onToggleFavorite && onToggleFavorite(prompt); }}
                            className={clsx(
                                "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 backdrop-blur-sm",
                                prompt.is_favorite
                                    ? "bg-accent-500/10 text-accent-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                                    : "bg-bg-elevated/50 text-text-muted hover:bg-bg-hover hover:text-text-primary"
                            )}
                        >
                            <Star className={clsx("w-4 h-4", prompt.is_favorite && "fill-current")} />
                        </button>

                        {/* Menu sempre visível para Mobile/Desktop */}
                        <Menu as="div" className="relative">
                            <Menu.Button
                                className="w-9 h-9 rounded-xl flex items-center justify-center bg-bg-elevated/50 text-text-muted hover:bg-bg-hover hover:text-text-primary transition-all duration-200 backdrop-blur-sm"
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
                                <Menu.Items className="absolute right-0 top-full mt-2 w-44 origin-top-right rounded-2xl bg-bg-elevated border border-border-default shadow-xl z-50 py-2 focus:outline-none backdrop-blur-md">
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
                                                    active ? "bg-red-500/10 text-red-400" : "text-text-secondary"
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

                {/* Conteúdo: Preview sutil */}
                <p className="text-text-secondary/80 text-sm leading-relaxed mb-6 line-clamp-3">
                    {prompt.content}
                </p>

                {/* Tags Única Localização - Visual Limpo, sem borda */}
                {prompt.tags && prompt.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {prompt.tags.map(tag => (
                            <span key={tag} className="text-[10px] font-bold text-primary-500/70 tracking-wider uppercase bg-primary-500/5 px-2 py-0.5 rounded-md">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Footer: Stats + Ação Principal (Sem Linha Divisória) */}
                <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-text-muted/50">
                        <Zap className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-semibold tracking-widest uppercase">{copyCount} usos</span>
                    </div>

                    {/* Botão Copiar Direto com Feedback Visual Forte */}
                    <button
                        onClick={handleCopyDirect}
                        className={clsx(
                            "group/copy relative flex items-center gap-2 px-5 py-2.5 rounded-2xl transition-all duration-300 font-bold text-xs active:scale-95",
                            copied
                                ? "bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                                : "bg-primary-500 text-white hover:shadow-[0_0_25px_rgba(249,115,22,0.3)] hover:scale-[1.02]"
                        )}
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 animate-in zoom-in duration-300" />
                                <span>Copiado!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4 transition-transform group-hover/copy:rotate-12" />
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
