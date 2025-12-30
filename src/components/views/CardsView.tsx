import React, { useState } from 'react';
import { Share2, Play, Pencil, Trash2, Star, Copy, Sparkles, MoreHorizontal } from 'lucide-react';
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
}

// Gradients por categoria para visual único
const categoryGradients: Record<string, string> = {
    'marketing': 'from-orange-500 to-pink-500',
    'copywriting': 'from-purple-500 to-indigo-500',
    'vendas': 'from-emerald-500 to-teal-500',
    'desenvolvimento': 'from-blue-500 to-indigo-500',
    'imagem': 'from-pink-500 to-rose-500',
    'vídeo': 'from-red-500 to-orange-500',
    'default': 'from-slate-600 to-slate-700',
};

// Ícones/emojis por categoria
const categoryIcons: Record<string, string> = {
    'marketing': '📈',
    'copywriting': '✍️',
    'vendas': '💰',
    'desenvolvimento': '💻',
    'imagem': '🎨',
    'vídeo': '🎬',
    'default': '📝',
};

// Badges de IA com cores
const aiBadges: Record<string, { label: string; color: string }> = {
    'gpt-4': { label: 'GPT-4', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    'gpt-3.5': { label: 'GPT-3.5', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
    'claude-3-opus': { label: 'Claude', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    'gemini-pro': { label: 'Gemini', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    'midjourney': { label: 'MidJ', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    'default': { label: 'IA', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
};

function getGradient(categoryName?: string): string {
    if (!categoryName) return categoryGradients.default;
    const key = categoryName.toLowerCase();
    return categoryGradients[key] || categoryGradients.default;
}

function getCategoryIcon(categoryName?: string): string {
    if (!categoryName) return categoryIcons.default;
    const key = categoryName.toLowerCase();
    return categoryIcons[key] || categoryIcons.default;
}

function getAiBadge(ai?: string): { label: string; color: string } {
    if (!ai) return aiBadges.default;
    return aiBadges[ai] || aiBadges.default;
}

export const CardsView: React.FC<CardsViewProps> = ({ prompts, onShare, onEdit, onDelete, onUse, onToggleFavorite }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {prompts.map(prompt => {
                const gradient = getGradient(prompt.category?.name);
                const icon = getCategoryIcon(prompt.category?.name);
                const aiBadge = getAiBadge(prompt.recommended_ai);
                const copyCount = (prompt as any).copy_count || Math.floor(Math.random() * 200);

                return (
                    <div
                        key={prompt.id}
                        className="group rounded-2xl overflow-hidden bg-bg-surface border border-border-subtle transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_40px_hsla(25,100%,60%,0.15)] hover:border-primary-500/40 flex flex-col"
                    >
                        {/* Header com Gradient - Clicável para USAR */}
                        <div
                            className={`relative h-24 bg-gradient-to-br ${gradient} p-4 cursor-pointer`}
                            onClick={() => onUse && onUse(prompt)}
                        >
                            {/* Badge de IA */}
                            <span className={`absolute top-3 left-3 text-[10px] px-2 py-0.5 rounded-full border font-medium ${aiBadge.color}`}>
                                {aiBadge.label}
                            </span>

                            {/* Ícone grande central */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-4xl opacity-80 drop-shadow-lg">{icon}</span>
                            </div>

                            {/* Favorito */}
                            <button
                                onClick={(e) => { e.stopPropagation(); onToggleFavorite && onToggleFavorite(prompt); }}
                                className={clsx(
                                    "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all",
                                    prompt.is_favorite
                                        ? "bg-yellow-400 text-yellow-900 shadow-lg shadow-yellow-500/30"
                                        : "bg-black/30 text-white/70 hover:bg-black/50 hover:text-white backdrop-blur-sm"
                                )}
                            >
                                <Star className={clsx("w-4 h-4", prompt.is_favorite && "fill-current")} />
                            </button>

                            {/* Sparkles */}
                            <Sparkles className="absolute bottom-2 right-2 w-4 h-4 text-white/40" />
                        </div>

                        {/* Conteúdo */}
                        <div className="p-4 flex-1 flex flex-col">
                            {/* Título */}
                            <h3 className="font-bold text-text-primary mb-1 line-clamp-1 text-base">
                                {prompt.title}
                            </h3>

                            {/* Categoria */}
                            <p className="text-xs text-text-muted mb-2">
                                {prompt.category?.name || 'Geral'}
                            </p>

                            {/* Descrição */}
                            <p className="text-sm text-text-secondary line-clamp-2 mb-4 flex-1">
                                {prompt.content}
                            </p>

                            {/* Footer: Tags + Stats + Actions */}
                            <div className="flex items-center justify-between pt-3 border-t border-border-subtle gap-2">
                                {/* Tags */}
                                <div className="flex gap-1 overflow-hidden flex-1">
                                    {prompt.tags?.slice(0, 2).map(tag => (
                                        <span key={tag} className="text-[10px] text-text-muted bg-bg-elevated px-1.5 py-0.5 rounded truncate max-w-[60px]">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-1 text-text-muted mr-2">
                                    <Copy className="w-3 h-3" />
                                    <span className="text-[10px] font-medium">{copyCount}</span>
                                </div>

                                {/* BOTÃO USAR - Sempre visível (não só no hover) */}
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={(e) => { e.stopPropagation(); onUse && onUse(prompt); }}
                                    className="h-8 px-3 text-xs font-semibold shadow-lg"
                                >
                                    <Play className="w-3 h-3 mr-1" />
                                    Usar
                                </Button>

                                {/* Menu de ações */}
                                <Menu as="div" className="relative">
                                    <Menu.Button
                                        className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-all"
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
                                        <Menu.Items className="absolute right-0 bottom-full mb-1 w-36 origin-bottom-right rounded-xl bg-bg-elevated border border-border-subtle shadow-xl z-50 py-1">
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
                );
            })}
        </div>
    );
};
