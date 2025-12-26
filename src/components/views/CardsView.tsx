import React from 'react';
import { Share2, Copy } from 'lucide-react';
import { Prompt } from '../../types';

interface CardsViewProps {
    prompts: Prompt[];
    onShare: (prompt: Prompt) => void;
}

export const CardsView: React.FC<CardsViewProps> = ({ prompts, onShare }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {prompts.map(prompt => (
                <div key={prompt.id} className="bg-bg-surface border border-border-subtle rounded-xl p-5 hover:border-[#3b82f680] hover:shadow-glow transition-all group cursor-pointer">
                    <div className="flex justify-between items-start mb-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium bg-[#3b82f61a] text-primary-500`}>
                            {prompt.category?.name || 'Geral'}
                        </span>
                        {prompt.is_favorite && <span className="text-accent-500">★</span>}
                    </div>
                    <h3 className="font-semibold text-text-primary mb-2 line-clamp-1">{prompt.title}</h3>
                    <p className="text-sm text-text-secondary line-clamp-3 mb-4">{prompt.content}</p>
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-border-subtle">
                        <div className="flex gap-1">
                            {prompt.tags.map(tag => (
                                <span key={tag} className="text-[10px] text-text-muted bg-bg-elevated px-1.5 py-0.5 rounded">{tag}</span>
                            ))}
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={(e) => { e.stopPropagation(); onShare(prompt); }}
                                className="text-xs font-medium text-text-secondary hover:text-primary-500 flex items-center gap-1"
                                title="Compartilhar"
                            >
                                <Share2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                                className="text-xs font-medium text-text-secondary hover:text-primary-500 flex items-center gap-1"
                                title="Copiar"
                            >
                                <Copy className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
