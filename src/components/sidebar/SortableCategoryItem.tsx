import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronRight, ChevronDown, Folder, GripVertical } from 'lucide-react';
import { Category } from '../../types';
import { clsx } from 'clsx';

interface SortableCategoryItemProps {
    category: Category;
    depth: number;
    onToggleExpand: (id: string) => void;
}

export function SortableCategoryItem({ category, depth, onToggleExpand }: SortableCategoryItemProps) {
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
        paddingLeft: `${depth * 12 + 8}px`,
        opacity: isDragging ? 0.5 : 1,
    };

    const hasChildren = category.children && category.children.length > 0;

    return (
        <div ref={setNodeRef} style={style} className={clsx("group relative", isDragging && "z-50")}>
            <div className="flex items-center gap-2 py-1.5 px-2 hover:bg-bg-hover rounded-md text-sm text-text-secondary hover:text-text-primary cursor-pointer transition-colors">

                {/* Drag Handle - Visible on hover */}
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
                    className={clsx("p-0.5 rounded hover:bg-bg-active", !hasChildren && "invisible")}
                >
                    {category.is_expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>

                {/* Icon & Name */}
                <span className="text-base" style={{ color: category.color }}>
                    {category.icon ? category.icon : <Folder className="w-4 h-4 fill-current opacity-50" />}
                </span>

                <span className="truncate flex-1">{category.name}</span>

                {/* Count */}
                <span className="text-xs text-text-muted opacity-0 group-hover:opacity-100 bg-bg-elevated px-1.5 rounded-full">
                    {category.prompt_count}
                </span>
            </div>
        </div>
    );
}
