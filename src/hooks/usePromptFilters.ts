import { useState, useMemo } from 'react';
import { Prompt, Category } from '../types';

interface FilterState {
    category_id: string | null;
    tags: string[];
    only_favorites: boolean;
    sort_by: 'newest' | 'oldest' | 'az' | 'za';
    recommended_ai: string | null;
}

interface UsePromptFiltersOptions {
    searchQuery?: string;
    categoryId?: string | null;
    categories?: Category[]; // All categories for subcategory filtering
    tags?: string[];
    onlyFavorites?: boolean;
    recommendedAi?: string | null;
}

// Helper function to get all descendant category IDs (including the parent)
function getCategoryAndDescendants(categoryId: string, allCategories: Category[]): string[] {
    const result: string[] = [categoryId];
    const children = allCategories.filter(c => c.parent_id === categoryId);
    for (const child of children) {
        result.push(...getCategoryAndDescendants(child.id, allCategories));
    }
    return result;
}

export function usePromptFilters(prompts: Prompt[], options: UsePromptFiltersOptions = {}) {
    // Internal state for sort only, or other non-global filters if needed
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'az' | 'za'>('newest');

    const filteredPrompts = useMemo(() => {
        return prompts.filter(prompt => {
            // Text Search
            if (options.searchQuery) {
                const searchLower = options.searchQuery.toLowerCase();
                const matchesTitle = prompt.title.toLowerCase().includes(searchLower);
                // Safe check for content
                const matchesContent = (prompt.content || '').toLowerCase().includes(searchLower);
                if (!matchesTitle && !matchesContent) return false;
            }

            // Category Filter (including subcategories)
            if (options.categoryId && options.categories) {
                const allowedCategoryIds = getCategoryAndDescendants(options.categoryId, options.categories);
                if (!prompt.category_id || !allowedCategoryIds.includes(prompt.category_id)) {
                    return false;
                }
            } else if (options.categoryId && prompt.category_id !== options.categoryId) {
                // Fallback if no categories array provided
                return false;
            }

            // Favorites Filter
            if (options.onlyFavorites && !prompt.is_favorite) {
                return false;
            }

            // Tags Filter (Multi tag support)
            if (options.tags && options.tags.length > 0) {
                const promptTags = prompt.tags || [];
                // Check if prompt has at least one of the selected tags
                const hasMatchingTag = options.tags.some(tag => promptTags.includes(tag));
                if (!hasMatchingTag) return false;
            }

            // IA Filter
            if (options.recommendedAi && prompt.recommended_ai !== options.recommendedAi) {
                return false;
            }

            return true;
        }).sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                case 'oldest':
                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                case 'az':
                    return a.title.localeCompare(b.title);
                case 'za':
                    return b.title.localeCompare(a.title);
                default:
                    return 0;
            }
        });
    }, [prompts, options, sortBy]);

    // Derived lists for filter options
    const availableTags = useMemo(() => {
        const tags = new Set<string>();
        prompts.forEach(p => p.tags?.forEach(t => tags.add(t)));
        return Array.from(tags).sort();
    }, [prompts]);

    return {
        filteredPrompts,
        availableTags,
        sortBy,
        setSortBy
    };
}
