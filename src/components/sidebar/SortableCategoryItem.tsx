import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronRight, ChevronDown, MoreHorizontal, Edit2, Trash, GripVertical } from 'lucide-react';
import { Category } from '../../types';
import { clsx } from 'clsx';
import { useStore } from '../../contexts/StoreContext';

interface SortableCategoryItemProps {
    category: Category;
    depth: number;
    onToggleExpand: (id: string) => void;
}

export function SortableCategoryItem({ category, depth, onToggleExpand }: SortableCategoryItemProps) {
    const { deleteCategory, setCreateCategoryModalOpen } = useStore();
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
        paddingLeft: `${depth * 12 + 12}px`,
        opacity: isDragging ? 0.5 : 1,
    };

    const hasChildren = category.children && category.children.length > 0;

    // TODO: Implement Edit Logic properly (needs to pass category to modal)
    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        alert("TODO: Implement Open Edit Modal with ID: " + category.id);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Tem certeza que deseja excluir esta categoria e seus prompts?')) {
            deleteCategory(category.id);
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
            <div className="flex items-center gap-2 py-1.5 px-2 hover:bg-bg-hover rounded-md text-sm text-text-secondary hover:text-text-primary cursor-pointer transition-colors border border-transparent hover:border-border-subtle">

                {/* Drag Handle */}
                <div
                    {...attributes}
                    {...listeners}
                    className="opacity-0 group-hover:opacity-100 p-0.5 cursor-grab text-text-muted hover:text-text-primary"
                >
                    <GripVertical className="w-3 h-3" />
                </div>

                {/* Expand Toggle */}
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleExpand(category.id); }}
                    className={clsx("p-0.5 rounded hover:bg-bg-active transition-opacity", !hasChildren && "invisible")}
                >
                    {category.is_expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>

                {/* Premium Icon: Color Box with Initial */}
                <div
                    className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                    style={{ backgroundColor: category.color }}
                >
                    {category.name.charAt(0).toUpperCase()}
                </div>

                <span className="truncate flex-1 font-medium">{category.name}</span>

                {/* Count */}
                <span className="text-[10px] text-text-muted group-hover:hidden bg-bg-elevated px-1.5 py-0.5 rounded-full">
                    {category.prompt_count}
                </span>

                {/* Actions */}
                <div className={clsx("flex items-center gap-1", !showActions && "hidden")}>
                    <button onClick={handleEdit} className="p-1 hover:bg-bg-active rounded text-text-muted hover:text-primary-500" title="Editar">
                        <Edit2 className="w-3 h-3" />
                    </button>
                    <button onClick={handleDelete} className="p-1 hover:bg-bg-active rounded text-text-muted hover:text-error-500" title="Excluir">
                        <Trash className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </div>
    );
}
