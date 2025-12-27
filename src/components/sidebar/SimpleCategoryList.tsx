import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import { Category } from '../../types';
import { clsx } from 'clsx';
import { useStore } from '../../contexts/StoreContext';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface SimpleCategoryListProps {
    categories: Category[];
    depth?: number;
}

export function SimpleCategoryList({ categories, depth = 0 }: SimpleCategoryListProps) {
    const { selectedCategoryId, setSelectedCategoryId, toggleCategoryExpand, setEditingCategory, setCreateCategoryModalOpen, deleteCategory } = useStore();

    if (categories.length === 0) {
        return depth === 0 ? (
            <p className="text-xs text-text-muted text-center py-4">Nenhuma categoria</p>
        ) : null;
    }

    const handleEdit = (e: React.MouseEvent, category: Category) => {
        e.stopPropagation();
        setEditingCategory(category);
        setCreateCategoryModalOpen(true);
    };

    const handleDelete = (e: React.MouseEvent, category: Category) => {
        e.stopPropagation();
        if (confirm(`Excluir categoria "${category.name}" e mover prompts para "Sem Categoria"?`)) {
            deleteCategory(category.id);
        }
    };

    return (
        <div className="space-y-0.5">
            {categories.map(category => {
                const hasChildren = category.children && category.children.length > 0;
                const isSelected = selectedCategoryId === category.id;

                return (
                    <div key={category.id}>
                        <div
                            onClick={() => setSelectedCategoryId(isSelected ? null : category.id)}
                            style={{ paddingLeft: `${depth * 16 + 8}px` }}
                            className={clsx(
                                "group flex items-center gap-2 py-2 px-2 rounded-lg text-sm cursor-pointer transition-all",
                                isSelected
                                    ? "bg-primary-500/10 text-primary-500 font-medium"
                                    : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
                            )}
                        >
                            {/* Expand Toggle */}
                            {hasChildren ? (
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleCategoryExpand(category.id); }}
                                    className="w-4 h-4 flex items-center justify-center text-text-muted hover:text-text-primary"
                                >
                                    {category.is_expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                </button>
                            ) : (
                                <div className="w-4" />
                            )}

                            {/* Color Box Icon */}
                            <div
                                className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white shadow-sm flex-shrink-0"
                                style={{ backgroundColor: category.color || '#3b82f6' }}
                            >
                                {category.name.charAt(0).toUpperCase()}
                            </div>

                            {/* Name */}
                            <span className="truncate flex-1">{category.name}</span>

                            {/* Count - hide on hover */}
                            <span className={clsx(
                                "text-[10px] px-1.5 py-0.5 rounded-full group-hover:hidden",
                                isSelected ? "bg-primary-500 text-white" : "text-text-muted bg-bg-elevated"
                            )}>
                                {category.prompt_count || 0}
                            </span>

                            {/* Actions - show on hover */}
                            <div className="hidden group-hover:flex items-center gap-0.5">
                                <button
                                    onClick={(e) => handleEdit(e, category)}
                                    className="p-1 rounded hover:bg-primary-500/20 text-text-muted hover:text-primary-500 transition-colors"
                                    title="Editar"
                                >
                                    <Pencil className="w-3 h-3" />
                                </button>
                                <button
                                    onClick={(e) => handleDelete(e, category)}
                                    className="p-1 rounded hover:bg-error-500/20 text-text-muted hover:text-error-500 transition-colors"
                                    title="Excluir"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        </div>

                        {/* Children */}
                        {category.is_expanded && hasChildren && (
                            <SimpleCategoryList categories={category.children!} depth={depth + 1} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
