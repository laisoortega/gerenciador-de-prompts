import { useState, Fragment, useMemo } from 'react';
import { Filter, Hash, Star, X, ChevronDown, ArrowUpDown, Bot, Check, SlidersHorizontal } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import clsx from 'clsx';
import { Menu, Transition, Dialog } from '@headlessui/react';
import { Button } from './ui/Button';
import { Category } from '../types';

interface FilterBarProps {
    filters: {
        category_id: string | null;
        tags: string[];
        only_favorites: boolean;
        sort_by: 'newest' | 'oldest' | 'az' | 'za';
        recommended_ai: string | null;
    };
    availableTags: string[];
    onFilterChange: (key: any, value: any) => void;
    onClear: () => void;
}

// Helper to flatten category tree with depth info for hierarchy display
function flattenCategories(categories: Category[], depth: number = 0): { category: Category; depth: number }[] {
    let result: { category: Category; depth: number }[] = [];
    for (const cat of categories) {
        result.push({ category: cat, depth });
        if (cat.children && cat.children.length > 0) {
            result = result.concat(flattenCategories(cat.children, depth + 1));
        }
    }
    return result;
}

export function FilterBar({ filters, availableTags, onFilterChange, onClear }: FilterBarProps) {
    const { categoryTree } = useStore();
    const [isMobileFilterOpen, setMobileFilterOpen] = useState(false);

    const hasActiveFilters = filters.category_id || filters.tags.length > 0 || filters.only_favorites || filters.recommended_ai;
    const activeFilterCount = [
        filters.category_id,
        filters.tags.length > 0,
        filters.only_favorites,
        filters.recommended_ai
    ].filter(Boolean).length;

    // Flatten category tree for hierarchical dropdown
    const flatCategories = useMemo(() => flattenCategories(categoryTree), [categoryTree]);

    // Tags helpers
    const handleSelectAllTags = () => onFilterChange('tags', availableTags);
    const handleClearTags = () => onFilterChange('tags', []);

    // Mobile Filter Drawer Component
    const MobileFilterDrawer = () => (
        <Transition show={isMobileFilterOpen} as={Fragment}>
            <Dialog onClose={() => setMobileFilterOpen(false)} className="relative z-50 md:hidden">
                {/* Backdrop */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                {/* Drawer */}
                <div className="fixed inset-x-0 bottom-0 z-50">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="translate-y-full"
                        enterTo="translate-y-0"
                        leave="ease-in duration-200"
                        leaveFrom="translate-y-0"
                        leaveTo="translate-y-full"
                    >
                        <Dialog.Panel className="bg-bg-surface rounded-t-2xl max-h-[85vh] overflow-hidden flex flex-col pb-safe">
                            {/* Handle */}
                            <div className="flex justify-center py-3">
                                <div className="w-10 h-1 rounded-full bg-border-default" />
                            </div>

                            {/* Header */}
                            <div className="flex items-center justify-between px-4 pb-3 border-b border-border-subtle">
                                <Dialog.Title className="text-lg font-semibold text-text-primary">
                                    Filtros
                                </Dialog.Title>
                                <button
                                    onClick={() => setMobileFilterOpen(false)}
                                    className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Filters Content */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-5 scroll-mobile">
                                {/* Category Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                        Categoria
                                    </label>
                                    <select
                                        value={filters.category_id || ''}
                                        onChange={(e) => onFilterChange('category_id', e.target.value || null)}
                                        className="w-full px-3 py-3 bg-bg-elevated border border-border-default rounded-xl text-sm text-text-primary focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                                    >
                                        <option value="">Todas Categorias</option>
                                        {flatCategories.map(({ category, depth }) => (
                                            <option key={category.id} value={category.id}>
                                                {'—'.repeat(depth)} {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* IA Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                        IA Recomendada
                                    </label>
                                    <select
                                        value={filters.recommended_ai || ''}
                                        onChange={(e) => onFilterChange('recommended_ai', e.target.value || null)}
                                        className="w-full px-3 py-3 bg-bg-elevated border border-border-default rounded-xl text-sm text-text-primary focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                                    >
                                        <option value="">Todas IAs</option>
                                        <option value="gpt-4">GPT-4</option>
                                        <option value="gpt-3.5">GPT-3.5</option>
                                        <option value="claude-3-opus">Claude</option>
                                        <option value="gemini-pro">Gemini</option>
                                        <option value="midjourney">Midjourney</option>
                                    </select>
                                </div>

                                {/* Sort */}
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                        Ordenar por
                                    </label>
                                    <select
                                        value={filters.sort_by || 'newest'}
                                        onChange={(e) => onFilterChange('sort_by', e.target.value)}
                                        className="w-full px-3 py-3 bg-bg-elevated border border-border-default rounded-xl text-sm text-text-primary focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                                    >
                                        <option value="newest">Mais Recentes</option>
                                        <option value="oldest">Mais Antigos</option>
                                        <option value="az">A-Z</option>
                                        <option value="za">Z-A</option>
                                    </select>
                                </div>

                                {/* Favorites Toggle */}
                                <div>
                                    <button
                                        onClick={() => onFilterChange('only_favorites', !filters.only_favorites)}
                                        className={clsx(
                                            "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm border transition-all",
                                            filters.only_favorites
                                                ? "bg-accent-500/15 border-accent-500/30 text-accent-500"
                                                : "bg-bg-elevated border-border-default text-text-secondary"
                                        )}
                                    >
                                        <span className="flex items-center gap-2">
                                            <Star className={clsx("w-4 h-4", filters.only_favorites && "fill-current")} />
                                            Apenas Favoritos
                                        </span>
                                        <div className={clsx(
                                            "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                            filters.only_favorites ? "border-accent-500 bg-accent-500" : "border-border-default"
                                        )}>
                                            {filters.only_favorites && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                    </button>
                                </div>

                                {/* Tags */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium text-text-secondary">
                                            Tags ({filters.tags.length}/{availableTags.length})
                                        </label>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleSelectAllTags}
                                                className="text-xs text-primary-500 hover:text-primary-400 font-medium"
                                            >
                                                Todas
                                            </button>
                                            <span className="text-text-muted">|</span>
                                            <button
                                                onClick={handleClearTags}
                                                className="text-xs text-text-muted hover:text-error-500 font-medium"
                                            >
                                                Limpar
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {availableTags.length === 0 ? (
                                            <p className="text-sm text-text-muted py-2">Nenhuma tag disponível</p>
                                        ) : (
                                            availableTags.map(tag => {
                                                const isSelected = filters.tags.includes(tag);
                                                return (
                                                    <button
                                                        key={tag}
                                                        onClick={() => {
                                                            const newTags = isSelected
                                                                ? filters.tags.filter(t => t !== tag)
                                                                : [...filters.tags, tag];
                                                            onFilterChange('tags', newTags);
                                                        }}
                                                        className={clsx(
                                                            "px-3 py-2 rounded-lg text-sm transition-all",
                                                            isSelected
                                                                ? "bg-primary-500/15 text-primary-400 border border-primary-500/30"
                                                                : "bg-bg-elevated text-text-secondary border border-border-default"
                                                        )}
                                                    >
                                                        {tag}
                                                    </button>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="flex gap-3 p-4 border-t border-border-subtle bg-bg-surface">
                                {hasActiveFilters && (
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            onClear();
                                            setMobileFilterOpen(false);
                                        }}
                                        className="flex-1"
                                    >
                                        Limpar Filtros
                                    </Button>
                                )}
                                <Button
                                    variant="primary"
                                    onClick={() => setMobileFilterOpen(false)}
                                    className="flex-1"
                                >
                                    Aplicar
                                </Button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );

    return (
        <>
            {/* Mobile Filter Button */}
            <div className="md:hidden flex items-center gap-2 mb-4">
                <button
                    onClick={() => setMobileFilterOpen(true)}
                    className={clsx(
                        "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all touch-target",
                        hasActiveFilters
                            ? "bg-primary-500/10 border border-primary-500/30 text-primary-500"
                            : "bg-bg-surface border border-border-default text-text-secondary"
                    )}
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filtros
                    {activeFilterCount > 0 && (
                        <span className="bg-primary-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                            {activeFilterCount}
                        </span>
                    )}
                </button>

                {/* Quick favorites toggle on mobile */}
                <button
                    onClick={() => onFilterChange('only_favorites', !filters.only_favorites)}
                    className={clsx(
                        "p-2.5 rounded-xl border transition-all touch-target",
                        filters.only_favorites
                            ? "bg-accent-500/15 border-accent-500/30 text-accent-500"
                            : "bg-bg-surface border-border-default text-text-secondary"
                    )}
                >
                    <Star className={clsx("w-5 h-5", filters.only_favorites && "fill-current")} />
                </button>

                {/* Sort dropdown on mobile */}
                <div className="relative ml-auto">
                    <select
                        value={filters.sort_by || 'newest'}
                        onChange={(e) => onFilterChange('sort_by', e.target.value)}
                        className="appearance-none px-3 py-2.5 pr-8 bg-bg-surface border border-border-default rounded-xl text-sm text-text-primary focus:border-primary-500"
                    >
                        <option value="newest">Recentes</option>
                        <option value="oldest">Antigos</option>
                        <option value="az">A-Z</option>
                        <option value="za">Z-A</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                </div>
            </div>

            {/* Desktop Filter Bar */}
            <div className="hidden md:flex flex-wrap items-center gap-3 bg-bg-surface/80 backdrop-blur-sm p-3 rounded-xl border border-border-subtle mb-4 shadow-sm relative z-20">
                {/* Left: Semantic Filters */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* Category Filter with Hierarchy */}
                    <div className="relative">
                        <select
                            value={filters.category_id || ''}
                            onChange={(e) => onFilterChange('category_id', e.target.value || null)}
                            className="appearance-none pl-3 pr-7 py-1.5 bg-bg-elevated border border-border-default rounded-lg text-sm text-text-primary hover:border-primary-500/50 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all cursor-pointer h-8"
                        >
                            <option value="">Todas Categorias</option>
                            {flatCategories.map(({ category, depth }) => (
                                <option key={category.id} value={category.id}>
                                    {'—'.repeat(depth)} {category.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                    </div>

                    {/* IA Filter */}
                    <div className="relative">
                        <select
                            value={filters.recommended_ai || ''}
                            onChange={(e) => onFilterChange('recommended_ai', e.target.value || null)}
                            className="appearance-none pl-7 pr-7 py-1.5 bg-bg-elevated border border-border-default rounded-lg text-sm text-text-primary hover:border-primary-500/50 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all cursor-pointer h-8"
                        >
                            <option value="">Todas IAs</option>
                            <option value="gpt-4">GPT-4</option>
                            <option value="gpt-3.5">GPT-3.5</option>
                            <option value="claude-3-opus">Claude</option>
                            <option value="gemini-pro">Gemini</option>
                            <option value="midjourney">Midjourney</option>
                        </select>
                        <Bot className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                    </div>

                    {/* Tags Dropdown with Select All/Clear */}
                    <Menu as="div" className="relative">
                        <Menu.Button as={Fragment}>
                            <button
                                className={clsx(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-all h-8",
                                    filters.tags.length > 0
                                        ? "bg-primary-500/10 border-primary-500/30 text-primary-400"
                                        : "bg-bg-elevated border-border-default text-text-secondary hover:border-primary-500/50"
                                )}
                            >
                                <Hash className="w-3.5 h-3.5" />
                                Tags
                                {filters.tags.length > 0 && (
                                    <span className="bg-primary-500 text-white text-[10px] px-1.5 rounded-full min-w-[18px] text-center">
                                        {filters.tags.length}
                                    </span>
                                )}
                            </button>
                        </Menu.Button>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute z-[100] left-0 mt-2 w-64 origin-top-left rounded-xl bg-bg-elevated border border-border-subtle shadow-2xl focus:outline-none overflow-hidden">
                                {/* Header with Select All / Clear */}
                                <div className="flex items-center justify-between px-3 py-2 border-b border-border-subtle bg-bg-surface/50">
                                    <span className="text-xs font-medium text-text-muted">
                                        {filters.tags.length}/{availableTags.length} selecionadas
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSelectAllTags}
                                            className="text-xs text-primary-500 hover:text-primary-400 font-medium"
                                        >
                                            Todas
                                        </button>
                                        <span className="text-text-muted">|</span>
                                        <button
                                            onClick={handleClearTags}
                                            className="text-xs text-text-muted hover:text-error-500 font-medium"
                                        >
                                            Limpar
                                        </button>
                                    </div>
                                </div>

                                {/* Tags List */}
                                <div className="p-2 max-h-48 overflow-y-auto">
                                    {availableTags.length === 0 ? (
                                        <div className="text-sm text-text-muted text-center py-4">Nenhuma tag disponível</div>
                                    ) : (
                                        availableTags.map(tag => {
                                            const isSelected = filters.tags.includes(tag);
                                            return (
                                                <button
                                                    key={tag}
                                                    onClick={() => {
                                                        const newTags = isSelected
                                                            ? filters.tags.filter(t => t !== tag)
                                                            : [...filters.tags, tag];
                                                        onFilterChange('tags', newTags);
                                                    }}
                                                    className={clsx(
                                                        "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors",
                                                        isSelected ? "bg-primary-500/10 text-primary-400" : "text-text-secondary hover:bg-bg-hover"
                                                    )}
                                                >
                                                    <div className={clsx(
                                                        "w-4 h-4 rounded border flex items-center justify-center",
                                                        isSelected ? "bg-primary-500 border-primary-500" : "border-border-default"
                                                    )}>
                                                        {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                                                    </div>
                                                    <span className="truncate">{tag}</span>
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>

                {/* Divider */}
                <div className="w-px h-5 bg-border-subtle"></div>

                {/* Right: Display Options */}
                <div className="flex items-center gap-2">
                    {/* Favorites Toggle */}
                    <button
                        onClick={() => onFilterChange('only_favorites', !filters.only_favorites)}
                        className={clsx(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-all h-8",
                            filters.only_favorites
                                ? "bg-accent-500/15 border-accent-500/30 text-accent-500"
                                : "bg-bg-elevated border-border-default text-text-secondary hover:border-accent-500/50 hover:text-accent-500"
                        )}
                    >
                        <Star className={clsx("w-3.5 h-3.5", filters.only_favorites && "fill-current")} />
                        <span className="hidden sm:inline">Favoritos</span>
                    </button>

                    {/* Sort */}
                    <div className="relative">
                        <select
                            value={filters.sort_by || 'newest'}
                            onChange={(e) => onFilterChange('sort_by', e.target.value)}
                            className="appearance-none pl-7 pr-7 py-1.5 bg-bg-elevated border border-border-default rounded-lg text-sm text-text-primary hover:border-primary-500/50 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all cursor-pointer h-8"
                        >
                            <option value="newest">Recentes</option>
                            <option value="oldest">Antigos</option>
                            <option value="az">A-Z</option>
                            <option value="za">Z-A</option>
                        </select>
                        <ArrowUpDown className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                    </div>
                </div>

                {/* Clear All button */}
                {hasActiveFilters && (
                    <>
                        <div className="w-px h-5 bg-border-subtle"></div>
                        <button
                            onClick={onClear}
                            className="flex items-center gap-1 text-xs text-text-muted hover:text-error-500 transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                            Limpar Tudo
                        </button>
                    </>
                )}
            </div>

            {/* Mobile Filter Drawer */}
            <MobileFilterDrawer />
        </>
    );
}
