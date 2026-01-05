// Updated: 2026-01-05 17:40 - Fixed button alignment
import React from 'react';
import { Share2, Pencil, Trash2, Star, Zap, MoreHorizontal, Play } from 'lucide-react';
import { Prompt } from '../../types';
import { Menu, Transition } from '@headlessui/react';

interface CardsViewProps {
    prompts: Prompt[];
    onShare: (prompt: Prompt) => void;
    onEdit?: (prompt: Prompt) => void;
    onDelete?: (prompt: Prompt) => void;
    onUse?: (prompt: Prompt) => void;
    onToggleFavorite?: (prompt: Prompt) => void;
    onView?: (prompt: Prompt) => void;
}

// Card otimizado e refinado
const PromptCard: React.FC<{
    prompt: Prompt;
    onShare: (prompt: Prompt) => void;
    onEdit?: (prompt: Prompt) => void;
    onDelete?: (prompt: Prompt) => void;
    onUse?: (prompt: Prompt) => void;
    onToggleFavorite?: (prompt: Prompt) => void;
    onView?: (prompt: Prompt) => void;
}> = ({ prompt, onShare, onEdit, onDelete, onUse, onToggleFavorite, onView }) => {
    const copyCount = (prompt as any).copy_count || 0;

    return (
        <div
            className="group relative flex flex-col h-full rounded-2xl overflow-hidden cursor-pointer transition-[transform,box-shadow] duration-200 hover:scale-[1.01] hover:shadow-xl"
            onClick={() => onView && onView(prompt)}
            style={{ willChange: 'transform' }}
        >
            {/* Background - SEM BLUR */}
            <div className="absolute inset-0 bg-white dark:bg-gray-900/50" />

            {/* Borda */}
            <div className="absolute inset-0 rounded-2xl border border-gray-200 dark:border-white/10 group-hover:border-gray-300 dark:group-hover:border-white/20 transition-colors duration-200" />

            {/* Hover Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-accent-500/0 group-hover:from-primary-500/[0.02] group-hover:to-accent-500/[0.02] dark:group-hover:from-primary-500/5 dark:group-hover:to-accent-500/5 transition-opacity duration-200 pointer-events-none rounded-2xl" />

            {/* Content */}
            <div className="relative p-6 flex flex-col h-full z-10 space-y-4">

                {/* Header: Título + Favorito FIXO */}
                <div className="flex items-start justify-between gap-3">
                    <h3 className="flex-1 font-semibold text-lg text-gray-900 dark:text-white leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                        {prompt.title}
                    </h3>

                    {/* Favorito - SEMPRE VISÍVEL */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleFavorite && onToggleFavorite(prompt); }}
                        className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-accent-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-150"
                        title={prompt.is_favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    >
                        <Star className={`w-5 h-5 ${prompt.is_favorite ? 'fill-accent-500 text-accent-500' : ''}`} />
                    </button>
                </div>

                {/* Preview */}
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
                    {prompt.content}
                </p>

                {/* Tags - Compactas */}
                {prompt.tags && prompt.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {prompt.tags.map(tag => (
                            <span
                                key={tag}
                                className="px-2.5 py-1 rounded-md text-[11px] font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/[0.08] border border-gray-200/50 dark:border-white/[0.05] transition-colors duration-150 hover:bg-gray-200 dark:hover:bg-white/[0.12] hover:text-gray-900 dark:hover:text-white"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Footer: Stats + Botões - NUNCA QUEBRA */}
                <div className="mt-auto flex items-center gap-3 pt-3">
                    {/* Stats - Ocupa espaço restante */}
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 h-9 flex-1 min-w-0">
                        <Zap className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="text-xs font-medium leading-none whitespace-nowrap truncate">{copyCount} usos</span>
                    </div>

                    {/* Botões - Lado a lado, SEMPRE VISÍVEIS, SEM QUEBRA */}
                    <div className="flex items-center gap-2 flex-shrink-0 flex-nowrap">
                        {/* Menu - SEMPRE VISÍVEL */}
                        <Menu as="div" className="relative">
                            <Menu.Button
                                className="p-2.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-white transition-colors duration-150"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreHorizontal className="w-4 h-4" />
                            </Menu.Button>
                            <Transition
                                enter="transition duration-100 ease-out"
                                enterFrom="transform scale-95 opacity-0"
                                enterTo="transform scale-100 opacity-100"
                                leave="transition duration-75 ease-in"
                                leaveFrom="transform scale-100 opacity-100"
                                leaveTo="transform scale-95 opacity-0"
                            >
                                <Menu.Items className="absolute right-0 bottom-full mb-2 w-44 origin-bottom-right rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 shadow-xl z-50 py-1 focus:outline-none">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onEdit && onEdit(prompt); }}
                                                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${active ? "bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white" : "text-gray-700 dark:text-gray-300"
                                                    }`}
                                            >
                                                <Pencil className="w-4 h-4" /> Editar
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onShare(prompt); }}
                                                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${active ? "bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white" : "text-gray-700 dark:text-gray-300"
                                                    }`}
                                            >
                                                <Share2 className="w-4 h-4" /> Compartilhar
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <div className="h-px bg-gray-200 dark:bg-white/5 my-1" />
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onDelete && onDelete(prompt); }}
                                                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${active ? "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-400" : "text-gray-700 dark:text-gray-300"
                                                    }`}
                                            >
                                                <Trash2 className="w-4 h-4" /> Excluir
                                            </button>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </Transition>
                        </Menu>

                        {/* Botão USAR */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onUse && onUse(prompt);
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm shadow-md shadow-primary-500/25 hover:shadow-lg hover:shadow-primary-500/40 hover:scale-[1.02] transition-[transform,box-shadow] duration-200"
                        >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Usar</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const CardsView: React.FC<CardsViewProps> = ({ prompts, onShare, onEdit, onDelete, onUse, onToggleFavorite, onView }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
