import React from 'react';
import { Card } from '../ui/Card';
import { Tag } from '../ui/Tag';

interface Prompt {
    id: string;
    title: string;
    content: string;
    tags: string[];
    is_favorite: boolean;
    copy_count: number;
    created_at: string;
}

interface PromptCardProps {
    prompt: Prompt;
    onCopy: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onToggleFavorite: () => void;
}

// Icons
const Icons = {
    copy: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
    ),
    star: (filled: boolean) => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
    ),
    edit: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    ),
    trash: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3,6 5,6 21,6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
    ),
    more: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
        </svg>
    ),
};

export const PromptCard: React.FC<PromptCardProps> = ({
    prompt,
    onCopy,
    onEdit,
    onDelete,
    onToggleFavorite,
}) => {
    const [showActions, setShowActions] = React.useState(false);
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(prompt.content);
        setCopied(true);
        onCopy();
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card hoverable className="group relative">
            <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-base font-semibold text-[var(--color-text-primary)] line-clamp-1 pr-8">
                        {prompt.title}
                    </h3>
                    <button
                        onClick={onToggleFavorite}
                        className={`
              absolute top-3 right-3 p-1.5 rounded-lg transition-colors
              ${prompt.is_favorite
                                ? 'text-amber-400'
                                : 'text-[var(--color-text-muted)] hover:text-amber-400'
                            }
            `}
                    >
                        {Icons.star(prompt.is_favorite)}
                    </button>
                </div>

                {/* Content Preview */}
                <p className="text-sm text-[var(--color-text-secondary)] line-clamp-3 mb-4">
                    {prompt.content}
                </p>

                {/* Tags */}
                {prompt.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {prompt.tags.slice(0, 3).map((tag) => (
                            <Tag key={tag} label={tag} size="sm" />
                        ))}
                        {prompt.tags.length > 3 && (
                            <span className="text-xs text-[var(--color-text-muted)] self-center">
                                +{prompt.tags.length - 3}
                            </span>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
                    <span className="text-xs text-[var(--color-text-muted)]">
                        {prompt.copy_count} {prompt.copy_count === 1 ? 'cópia' : 'cópias'}
                    </span>

                    <div className="flex items-center gap-1">
                        {/* Copy Button */}
                        <button
                            onClick={handleCopy}
                            className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                ${copied
                                    ? 'bg-[var(--color-success)] text-white'
                                    : 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]'
                                }
              `}
                        >
                            {Icons.copy}
                            {copied ? 'Copiado!' : 'Copiar'}
                        </button>

                        {/* More Actions */}
                        <div className="relative">
                            <button
                                onClick={() => setShowActions(!showActions)}
                                className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
                            >
                                {Icons.more}
                            </button>

                            {showActions && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowActions(false)}
                                    />
                                    <div className="absolute right-0 bottom-full mb-1 z-20 py-1 min-w-[140px] bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg shadow-lg">
                                        <button
                                            onClick={() => { onEdit(); setShowActions(false); }}
                                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] transition-colors"
                                        >
                                            {Icons.edit}
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => { onDelete(); setShowActions(false); }}
                                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--color-error)] hover:bg-[var(--color-bg-hover)] transition-colors"
                                        >
                                            {Icons.trash}
                                            Excluir
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};
