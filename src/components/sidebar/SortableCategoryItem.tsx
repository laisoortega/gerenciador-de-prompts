import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronRight, ChevronDown, Edit2, Trash, GripVertical } from 'lucide-react';
import { Category } from '../../types';
import { clsx } from 'clsx';
import { useStore } from '../../contexts/StoreContext';
import { Button } from '../ui/Button';

interface SortableCategoryItemProps {
    category: Category;
    depth: number;
    onToggleExpand: (id: string) => void;
}

export function SortableCategoryItem({ category, depth, onToggleExpand }: SortableCategoryItemProps) {
    const { deleteCategory, setCreateCategoryModalOpen, setEditingCategory, selectedCategoryId, setSelectedCategoryId } = useStore();
    const [showActions, setShowActions] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: category.id, data: { type: 'category', category } });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        paddingLeft: `${depth * 16 + 8}px`,
        opacity: isDragging ? 0.5 : 1,
    };

    const hasChildren = category.children && category.children.length > 0;
    const isSelected = selectedCategoryId === category.id;

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingCategory(category);
        setCreateCategoryModalOpen(true);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Tem certeza que deseja excluir esta categoria e seus prompts?')) {
            deleteCategory(category.id);
        }
    };

    const handleClick = () => {
        if (isSelected) {
            setSelectedCategoryId(null); // Deselect if already selected
        } else {
            setSelectedCategoryId(category.id);
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={clsx("group relative pr-2", isDragging && "z-50")}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <div
                onClick={handleClick}
                className={clsx(
                    "flex items-center gap-2 py-1.5 px-2 rounded-md text-sm cursor-pointer transition-colors border border-transparent",
                    isSelected
                        ? "bg-primary-500/10 text-primary-500 border-primary-500/20 font-medium"
                        : "text-text-secondary hover:bg-bg-hover hover:text-text-primary hover:border-border-subtle"
                )}
            >

                {/* Drag Handle */}
                <div
                    {...attributes}
                    {...listeners}
                    className="opacity-0 group-hover:opacity-100 cursor-grab text-text-muted hover:text-text-primary outline-none"
                    onClick={(e) => e.stopPropagation()}
                >
                    <GripVertical className="w-3 h-3" />
                </div>

                {/* Expand Toggle */}
                {hasChildren ? (
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleExpand(category.id); }}
                        className="w-5 h-5 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                    >
                        {category.is_expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                ) : (
                    <div className="w-5" />
                )}

                {/* Premium Icon: Color Box with Initial */}
                <div
                    className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white shadow-sm flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                >
                    {category.name.charAt(0).toUpperCase()}
                </div>

                <span className="truncate flex-1">{category.name}</span>

                {/* Count - show only when not hovering */}
                <span className={clsx(
                    "text-[10px] px-1.5 py-0.5 rounded-full transition-all",
                    isSelected
                        ? "bg-primary-500 text-white"
                        : showActions ? "opacity-0 absolute" : "text-text-muted bg-bg-elevated"
                )}>
                    {category.prompt_count || 0}
                </span>

                {/* Actions */}
                <div className={clsx("flex items-center gap-1 absolute right-2 bg-bg-surface pl-2 shadow-[-10px_0_10px_bg-surface]", !showActions && "hidden pointer-events-none")}>
                    <Button variant="ghost" size="icon" onClick={handleEdit} className="h-6 w-6 hover:text-primary-500">
                        <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleDelete} className="h-6 w-6 hover:text-error-500 hover:bg-error-500/10">
                        <Trash className="w-3 h-3" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
