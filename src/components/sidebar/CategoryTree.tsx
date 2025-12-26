import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
    DragOverlay
} from '@dnd-kit/core';
import {

    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { SortableCategoryItem } from './SortableCategoryItem';
import { Category } from '../../types';
import { createPortal } from 'react-dom';

interface CategoryTreeProps {
    categories: Category[];
    onToggleExpand: (id: string) => void;
    onMoveCategory: (id: string, newParentId: string | null, newIndex: number) => void;
}

// Helper to flatten tree for Dnd Context (if we were using a single flat list)
// But here we will try to use nested lists or just simple lists.
// For MVP Phase 2: We will just implement the rendering and simple sorting. 
// True tree DnD is complex (react-arborist or similar recommended usually).
// We will try a simple recursive render.

export function CategoryTree({ categories, onToggleExpand, onMoveCategory }: CategoryTreeProps) {
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Finding the item being dragged for Overlay
    const findCategory = (items: Category[], id: string): Category | undefined => {
        for (const item of items) {
            if (item.id === id) return item;
            if (item.children) {
                const found = findCategory(item.children, id);
                if (found) return found;
            }
        }
        return undefined;
    };

    const activeItem = activeId ? findCategory(categories, activeId) : null;

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const activeNode = findCategory(categories, active.id as string);
            const overNode = findCategory(categories, over.id as string);

            if (activeNode && overNode) {
                // If dropping on same parent, it's a reorder
                if (activeNode.parent_id === overNode.parent_id) {
                    onMoveCategory(active.id as string, activeNode.parent_id, 0); // TODO: Calculate index
                } else {
                    // If dropping on a different node, make it a child
                    // This is a simplified assumption for now.
                    // Ideally we'd check if we are dropping "on top" (nest) vs "between" (sibling)
                    onMoveCategory(active.id as string, overNode.id, 0);
                }
            }
        }

        setActiveId(null);
    }

    // Recursive component for list rendering
    const CategoryList = ({ items, depth = 0 }: { items: Category[], depth?: number }) => {
        return (
            <SortableContext
                items={items.map(i => i.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-0.5">
                    {items.map(category => (
                        <div key={category.id}>
                            <SortableCategoryItem
                                category={category}
                                depth={depth}
                                onToggleExpand={onToggleExpand}
                            />
                            {category.is_expanded && category.children && category.children.length > 0 && (
                                <CategoryList items={category.children} depth={depth + 1} />
                            )}
                        </div>
                    ))}
                </div>
            </SortableContext>
        );
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <CategoryList items={categories} />

            {createPortal(
                <DragOverlay>
                    {activeItem ? (
                        <div className="bg-bg-elevated p-2 rounded shadow-lg border border-primary-500 opacity-90 w-64">
                            <div className="flex items-center gap-2">
                                <span className="text-base">{activeItem.icon}</span>
                                <span className="font-medium text-text-primary">{activeItem.name}</span>
                            </div>
                        </div>
                    ) : null}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    );
}
