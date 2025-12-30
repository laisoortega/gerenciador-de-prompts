import { useState, useMemo } from 'react';
import { Prompt } from '../types';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import {
    Play,
    Pencil,
    Share2,
    Trash2,
    Star,
    Copy,
    Check,
    Tag,
    Calendar,
    Bot,
    ExternalLink
} from 'lucide-react';
import { RunPromptButton } from './RunPromptButton';
import clsx from 'clsx';

interface ViewPromptModalProps {
    prompt: Prompt;
    onClose: () => void;
    onEdit: () => void;
    onShare: () => void;
    onDelete: () => void;
    onUse: () => void;
    onToggleFavorite: () => void;
}

// Gradients por categoria
const categoryGradients: Record<string, string> = {
    'marketing': 'from-orange-500 to-pink-500',
    'copywriting': 'from-purple-500 to-indigo-500',
    'vendas': 'from-emerald-500 to-teal-500',
    'desenvolvimento': 'from-blue-500 to-indigo-500',
    'default': 'from-slate-600 to-slate-700',
};

// Badges de IA
const aiBadges: Record<string, { label: string; color: string }> = {
    'gpt-4': { label: 'GPT-4', color: 'bg-emerald-500/20 text-emerald-400' },
    'gpt-3.5': { label: 'GPT-3.5', color: 'bg-green-500/20 text-green-400' },
    'claude-3-opus': { label: 'Claude', color: 'bg-orange-500/20 text-orange-400' },
    'gemini-pro': { label: 'Gemini', color: 'bg-blue-500/20 text-blue-400' },
    'midjourney': { label: 'Midjourney', color: 'bg-purple-500/20 text-purple-400' },
    'default': { label: 'IA', color: 'bg-slate-500/20 text-slate-400' },
};

function getGradient(categoryName?: string): string {
    if (!categoryName) return categoryGradients.default;
    const key = categoryName.toLowerCase();
    return categoryGradients[key] || categoryGradients.default;
}

function getAiBadge(ai?: string) {
    if (!ai) return aiBadges.default;
    return aiBadges[ai] || aiBadges.default;
}

export function ViewPromptModal({
    prompt,
    onClose,
    onEdit,
    onShare,
    onDelete,
    onUse,
    onToggleFavorite
}: ViewPromptModalProps) {
    const [copied, setCopied] = useState(false);

    const gradient = getGradient(prompt.category?.name);
    const aiBadge = getAiBadge(prompt.recommended_ai);

    // Detectar variáveis
    const variables = useMemo(() => {
        const regex = /\{\{([^}]+)\}\}/g;
        const matches = [...prompt.content.matchAll(regex)].map(m => m[1].trim());
        return Array.from(new Set(matches));
    }, [prompt.content]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(prompt.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <Modal size="lg" onClose={onClose}>
            {/* Header com Gradient */}
            <div className={`relative h-28 bg-gradient-to-br ${gradient} -m-1 rounded-t-2xl`}>
                {/* Badge IA */}
                <span className={`absolute top-4 left-4 text-xs px-3 py-1 rounded-full font-medium ${aiBadge.color}`}>
                    <Bot className="w-3 h-3 inline-block mr-1" />
                    {aiBadge.label}
                </span>

                {/* Favorito */}
                <button
                    onClick={onToggleFavorite}
                    className={clsx(
                        "absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all",
                        prompt.is_favorite
                            ? "bg-primary-500 text-white shadow-lg"
                            : "bg-black/30 text-white/70 hover:bg-black/50 backdrop-blur-sm"
                    )}
                >
                    <Star className={clsx("w-5 h-5", prompt.is_favorite && "fill-current")} />
                </button>

                {/* Título sobrepondo */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <h2 className="text-xl font-bold text-white">{prompt.title}</h2>
                    <p className="text-sm text-white/80">{prompt.category?.name || 'Geral'}</p>
                </div>
            </div>

            <Modal.Body className="pt-4">
                {/* Metadados */}
                <div className="flex flex-wrap gap-3 mb-4 text-xs text-text-muted">
                    {prompt.created_at && (
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(prompt.created_at)}
                        </span>
                    )}
                    {variables.length > 0 && (
                        <span className="flex items-center gap-1 text-primary-400">
                            <Tag className="w-3 h-3" />
                            {variables.length} variáveis
                        </span>
                    )}
                </div>

                {/* Conteúdo do Prompt */}
                <div className="relative">
                    <div className="bg-bg-elevated rounded-xl p-4 border border-border-subtle">
                        <pre className="whitespace-pre-wrap font-mono text-sm text-text-primary leading-relaxed max-h-64 overflow-y-auto scrollbar-thin">
                            {prompt.content}
                        </pre>
                    </div>

                    {/* Botão copiar */}
                    <button
                        onClick={handleCopy}
                        className="absolute top-2 right-2 p-2 rounded-lg bg-bg-hover/80 backdrop-blur-sm text-text-muted hover:text-text-primary transition-all"
                    >
                        {copied ? <Check className="w-4 h-4 text-success-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>

                {/* Tags */}
                {prompt.tags && prompt.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {prompt.tags.map(tag => (
                            <span key={tag} className="text-xs bg-bg-elevated px-2 py-1 rounded-lg text-text-muted">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Variáveis detectadas */}
                {variables.length > 0 && (
                    <div className="mt-4 p-3 rounded-xl bg-primary-500/10 border border-primary-500/20">
                        <p className="text-xs text-primary-400 font-medium mb-2">
                            Variáveis neste prompt:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {variables.map(v => (
                                <code key={v} className="text-xs bg-primary-500/20 text-primary-300 px-2 py-0.5 rounded">
                                    {`{{${v}}}`}
                                </code>
                            ))}
                        </div>
                    </div>
                )}
            </Modal.Body>

            {/* Footer com Ações */}
            <Modal.Footer>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between w-full gap-3">
                    {/* Ações secundárias */}
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={onEdit} className="gap-1.5">
                            <Pencil className="w-4 h-4" />
                            <span className="hidden sm:inline">Editar</span>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={onShare} className="gap-1.5">
                            <Share2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Compartilhar</span>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={onDelete} className="gap-1.5 hover:text-error-500">
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Excluir</span>
                        </Button>
                    </div>

                    {/* Ação primária */}
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={handleCopy} className="gap-2">
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copiado!' : 'Copiar'}
                        </Button>
                        <Button variant="primary" onClick={onUse} className="gap-2 btn-shimmer">
                            <Play className="w-4 h-4" />
                            Usar Prompt
                        </Button>
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    );
}
