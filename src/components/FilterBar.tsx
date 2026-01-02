import { useState, Fragment } from 'react';
import { Star, X, SlidersHorizontal } from 'lucide-react';
import clsx from 'clsx';
import { Transition, Dialog } from '@headlessui/react';
import { Button } from './ui/Button';

interface FilterBarProps {
    filters: {
        category: string | null;
        only_favorites: boolean;
    };
    categories: string[];  // Categorias derivadas dos prompts
    onFilterChange: (key: string, value: any) => void;
    onClear: () => void;
}

export function FilterBar({ filters, categories, onFilterChange, onClear }: FilterBarProps) {
    const [isMobileFilterOpen, setMobileFilterOpen] = useState(false);

    const hasActiveFilters = filters.category || filters.only_favorites;

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
                            <div className="flex-1 overflow-y-auto p-4 space-y-5">
                                {/* Category Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                        Categoria
                                    </label>
                                    <select
                                        value={filters.category || ''}
                                        onChange={(e) => onFilterChange('category', e.target.value || null)}
                                        className="w-full px-3 py-3 bg-bg-elevated border border-border-default rounded-xl text-sm text-text-primary"
                                    >
                                        <option value="">Todas</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Favorites */}
                                <button
                                    onClick={() => onFilterChange('only_favorites', !filters.only_favorites)}
                                    className={clsx(
                                        "w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all",
                                        filters.only_favorites
                                            ? "bg-accent-500/10 border-accent-500/30"
                                            : "bg-bg-elevated border-border-default"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Star className={clsx("w-5 h-5", filters.only_favorites ? "text-accent-500 fill-current" : "text-text-muted")} />
                                        <span className="font-medium text-text-primary">Apenas Favoritos</span>
                                    </div>
                                    <div className={clsx(
                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                        filters.only_favorites ? "bg-accent-500 border-accent-500" : "border-border-default"
                                    )}>
                                        {filters.only_favorites && <div className="w-2 h-2 rounded-full bg-white" />}
                                    </div>
                                </button>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 p-4 border-t border-border-subtle">
                                <Button
                                    variant="ghost"
                                    className="flex-1"
                                    onClick={() => {
                                        onClear();
                                        setMobileFilterOpen(false);
                                    }}
                                >
                                    Limpar
                                </Button>
                                <Button
                                    variant="primary"
                                    className="flex-1"
                                    onClick={() => setMobileFilterOpen(false)}
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
            <div className="md:hidden flex items-center justify-between mb-4">
                <button
                    onClick={() => setMobileFilterOpen(true)}
                    className={clsx(
                        "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                        hasActiveFilters
                            ? "bg-primary-500/10 text-primary-500 border border-primary-500/30"
                            : "bg-bg-elevated text-text-secondary border border-border-subtle"
                    )}
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filtros
                    {hasActiveFilters && (
                        <span className="bg-primary-500 text-white text-[10px] px-1.5 rounded-full">
                            {[filters.category, filters.only_favorites].filter(Boolean).length}
                        </span>
                    )}
                </button>
            </div>

            {/* Desktop Filter Bar */}
            <div className="hidden md:block mb-4">
                {/* Category Chips - Centered */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {/* All */}
                    <button
                        onClick={() => onFilterChange('category', null)}
                        className={clsx(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all",
                            !filters.category
                                ? "bg-primary-500 text-white"
                                : "bg-bg-elevated text-text-secondary hover:bg-bg-hover hover:text-text-primary border border-border-subtle"
                        )}
                    >
                        Todos
                    </button>

                    {/* Dynamic Categories */}
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => onFilterChange('category', cat)}
                            className={clsx(
                                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                filters.category === cat
                                    ? "bg-primary-500 text-white"
                                    : "bg-bg-elevated text-text-secondary hover:bg-bg-hover hover:text-text-primary border border-border-subtle"
                            )}
                        >
                            {cat}
                        </button>
                    ))}

                    {/* Divider */}
                    {categories.length > 0 && <div className="w-px h-5 bg-border-subtle" />}

                    {/* Favorites Toggle */}
                    <button
                        onClick={() => onFilterChange('only_favorites', !filters.only_favorites)}
                        className={clsx(
                            "flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all",
                            filters.only_favorites
                                ? "bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 border border-yellow-400/40"
                                : "bg-bg-elevated text-text-muted hover:text-yellow-500 border border-border-subtle"
                        )}
                    >
                        <Star className={clsx("w-4 h-4", filters.only_favorites && "fill-current")} />
                        Favoritos
                    </button>
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            <MobileFilterDrawer />
        </>
    );
}
