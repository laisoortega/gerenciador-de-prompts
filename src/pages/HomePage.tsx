import React from 'react';
import { useStore } from '../contexts/StoreContext';
import { Link } from 'react-router-dom';
import {
    FileText,
    Star,
    FolderOpen,
    TrendingUp,
    Clock,
    ArrowRight,
    Sparkles,
    Plus
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import clsx from 'clsx';

// Gradients por categoria
const categoryGradients: Record<string, string> = {
    'marketing': 'from-orange-500 to-pink-500',
    'copywriting': 'from-purple-500 to-indigo-500',
    'vendas': 'from-emerald-500 to-teal-500',
    'desenvolvimento': 'from-blue-500 to-indigo-500',
    'default': 'from-primary-500 to-primary-600',
};

function getGradient(categoryName?: string): string {
    if (!categoryName) return categoryGradients.default;
    const key = categoryName.toLowerCase();
    return categoryGradients[key] || categoryGradients.default;
}

export const HomePage: React.FC = () => {
    const { prompts, categories, setCreatePromptModalOpen, user } = useStore();

    // Stats
    const totalPrompts = prompts.length;
    const totalFavorites = prompts.filter(p => p.is_favorite).length;
    const totalCategories = categories.length;
    const totalUses = prompts.reduce((acc, p) => acc + ((p as any).copy_count || 0), 0);

    // Prompts recentes (últimos 4)
    const recentPrompts = [...prompts]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 4);

    // Favoritos (primeiros 4)
    const favoritePrompts = prompts.filter(p => p.is_favorite).slice(0, 4);

    // Mais usados (primeiros 4)
    const mostUsedPrompts = [...prompts]
        .sort((a, b) => ((b as any).copy_count || 0) - ((a as any).copy_count || 0))
        .slice(0, 4);

    const stats = [
        { label: 'Prompts', value: totalPrompts, icon: FileText, color: 'text-primary-500' },
        { label: 'Favoritos', value: totalFavorites, icon: Star, color: 'text-primary-400' },
        { label: 'Categorias', value: totalCategories, icon: FolderOpen, color: 'text-accent-500' },
        { label: 'Usos', value: totalUses, icon: TrendingUp, color: 'text-success-500' },
    ];

    const PromptCard = ({ prompt, index }: { prompt: typeof prompts[0]; index: number }) => {
        const gradient = getGradient(prompt.category?.name);
        return (
            <Link
                to="/"
                className={clsx(
                    "card-premium hover-lift p-4 opacity-0 animate-fadeInSlow",
                    `stagger-${index + 1}`
                )}
            >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3`}>
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold text-text-primary line-clamp-1 mb-1">{prompt.title}</h4>
                <p className="text-xs text-text-muted line-clamp-2">{prompt.content}</p>
            </Link>
        );
    };

    const Section = ({ title, icon: Icon, prompts: sectionPrompts, link }: {
        title: string;
        icon: React.ElementType;
        prompts: typeof prompts;
        link: string;
    }) => (
        <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2 text-lg font-bold text-text-primary">
                    <Icon className="w-5 h-5 text-primary-500" />
                    {title}
                </h3>
                <Link to={link} className="text-sm text-text-muted hover:text-primary-500 flex items-center gap-1 transition-colors">
                    Ver todos <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
            {sectionPrompts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {sectionPrompts.map((prompt, i) => (
                        <PromptCard key={prompt.id} prompt={prompt} index={i} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 bg-bg-surface rounded-xl border border-border-subtle">
                    <p className="text-text-muted">Nenhum prompt ainda</p>
                </div>
            )}
        </section>
    );

    return (
        <div className="animate-fadeIn max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
            {/* Hero */}
            <div className="mb-8">
                <h1 className="text-3xl lg:text-4xl font-bold text-text-primary mb-2 text-glow">
                    Olá{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! 👋
                </h1>
                <p className="text-text-secondary">Gerencie seus prompts de IA de forma inteligente</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {stats.map((stat, i) => (
                    <div
                        key={stat.label}
                        className={clsx(
                            "card-premium p-5 opacity-0 animate-fadeInSlow",
                            `stagger-${i + 1}`
                        )}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <p className="text-3xl font-bold text-text-primary">{stat.value}</p>
                        <p className="text-sm text-text-muted">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Quick Action */}
            <div className="mb-10 card-premium p-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-text-primary mb-1">Pronto para criar?</h3>
                    <p className="text-sm text-text-muted">Crie um novo prompt em segundos</p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => setCreatePromptModalOpen(true)}
                    className="btn-cinematic gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Novo Prompt
                </Button>
            </div>

            {/* Sections */}
            <Section title="Recentes" icon={Clock} prompts={recentPrompts} link="/" />
            <Section title="Favoritos" icon={Star} prompts={favoritePrompts} link="/" />
            <Section title="Mais Usados" icon={TrendingUp} prompts={mostUsedPrompts} link="/" />
        </div>
    );
};
