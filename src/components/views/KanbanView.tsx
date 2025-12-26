import React, { useMemo, useState } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Prompt, Category } from '../../types';
import { Plus } from 'lucide-react';

interface KanbanViewProps {
    prompts: Prompt[];
    categories: Category[]; // Should be flat list of all categories to form columns? Or just top level?
    // For Kanban, typically we want ALL categories that have prompts?
    // Or just top level. We'll use top level + an "Uncategorized" column.
    onMovePrompt: (promptId: string, categoryId: string) => void;
}

// Draggable Prompt Card
function SortablePromptCard({ prompt }: { prompt: Prompt }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: prompt.id, data: { type: 'prompt', prompt } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-bg-surface border border-border-subtle p-3 rounded-lg shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing mb-2 group"
        >
            <div className="flex justify-between items-start mb-1.5">
                <span className="text-[10px] bg-primary-900/20 text-primary-500 px-1.5 py-0.5 rounded-full font-medium truncate max-w-[100px]">
                    {prompt.category?.name || 'Geral'}
                </span>
            </div>
            <h4 className="text-sm font-semibold text-text-primary line-clamp-2 mb-1">{prompt.title}</h4>
            <div className="flex gap-1 mt-2">
                {prompt.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[9px] text-text-muted bg-bg-base px-1 py-0.5 rounded border border-border-subtle">{tag}</span>
                ))}
            </div>
        </div>
    );
}

// Droppable Column
function KanbanColumn({ category, prompts }: { category: Category | null, prompts: Prompt[] }) {
    const { setNodeRef } = useSortable({
        id: category ? category.id : 'uncategorized',
        data: { type: 'column', category },
        disabled: true // Columns are not draggable for now
    });

    return (
        <div ref={setNodeRef} className="flex-shrink-0 w-72 flex flex-col h-full bg-bg-base/50 rounded-xl border border-border-subtle overflow-hidden">
            <div className="p-3 border-b border-border-subtle flex items-center justify-between sticky top-0 bg-bg-base z-10">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-primary text-sm">
                        {category ? category.name : 'Sem Categoria'}
                    </span>
                    <span className="text-xs text-text-muted bg-bg-elevated px-1.5 py-0.5 rounded-full">
                        {prompts.length}
                    </span>
                </div>
                <button className="text-text-muted hover:text-primary-500">
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-1 p-2 overflow-y-auto min-h-[100px]">
                <SortableContext
                    items={prompts.map(p => p.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {prompts.map(prompt => (
                        <SortablePromptCard key={prompt.id} prompt={prompt} />
                    ))}
                    {prompts.length === 0 && (
                        <div className="h-full flex items-center justify-center text-xs text-text-muted/50 py-10 dashed border border-border-subtle/30 rounded-lg">
                            Arraste prompts aqui
                        </div>
                    )}
                </SortableContext>
            </div>
        </div>
    );
}

export const KanbanView: React.FC<KanbanViewProps> = ({ prompts, categories, onMovePrompt }) => {
    const [activeId, setActiveId] = useState<string | null>(null);

    // Group prompts by category
    const groupedPrompts = useMemo(() => {
        const groups: Record<string, Prompt[]> = {};

        // Initialize groups for known categories (top level only for simplicity?)
        // Or all categories passed?
        categories.forEach(c => {
            groups[c.id] = [];
        });
        groups['uncategorized'] = [];

        prompts.forEach(p => {
            const catId = p.category_id || 'uncategorized';
            if (!groups[catId]) {
                // If nested category not in top level list, put in uncategorized or create dynamic column?
                // For this view, if we only show top level, we might hide nested prompts?
                // Or we show ALL categories as columns?
                // Showing all columns is too wide.
                // We'll just create the group dynamically if it exists in prompts
                if (!groups[catId]) groups[catId] = [];
            }
            groups[catId].push(p);
        });

        return groups;
    }, [prompts, categories]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            return;
        }

        const activePromptId = active.id as string;
        // Find prompt to get its current category
        const prompt = prompts.find(p => p.id === activePromptId);
        if (!prompt) return;

        // Determine target category
        // If dropped on a column (droppable container), over.id is the categoryId
        // If dropped on a card, over.data.current.sortable.containerId is the categoryId (if using separate contexts)

        let targetCategoryId: string | null = null;

        // We need to resolve the category ID from the over element
        if (active.id !== over.id) {
            // Logic to find which container we dropped into
            // dnd-kit SortableContext wraps items. over.id corresponds to an item if dropped on item.

            // Check if over is a container (column)
            if (over.data.current?.type === 'column') {
                targetCategoryId = over.id as string;
            } else if (over.data.current?.type === 'prompt') {
                // Dropped on another prompt -> get that prompt's category
                const overPrompt = prompts.find(p => p.id === over.id);
                if (overPrompt) {
                    targetCategoryId = overPrompt.category_id || 'uncategorized';
                }
            }
        }

        if (targetCategoryId && targetCategoryId !== (prompt.category_id || 'uncategorized')) {
            onMovePrompt(activePromptId, targetCategoryId === 'uncategorized' ? '' : targetCategoryId);
        }

        setActiveId(null);
    };

    const activePrompt = activeId ? prompts.find(p => p.id === activeId) : null;

    // Filter categories to show: Passed categories + any extra found in groups
    // Sort columns? Prioritize logical order
    // We'll show the passed categories first, then uncategorized

    // Simplification: Display only passed categories + Uncategorized.
    const columnsToShow = [
        { id: 'uncategorized', name: 'Sem Categoria' } as Category,
        ...categories
    ];

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-4 overflow-x-auto h-[calc(100vh-200px)] pb-4 px-1">
                {columnsToShow.map(cat => (
                    <KanbanColumn
                        key={cat.id}
                        category={cat.id === 'uncategorized' ? null : cat}
                        prompts={groupedPrompts[cat.id] || []}
                    />
                ))}
            </div>

            <DragOverlay>
                {activePrompt ? (
                    <div className="bg-bg-surface border border-primary-500 p-3 rounded-lg shadow-xl w-64 opacity-90 rotate-3 cursor-grabbing">
                        <h4 className="text-sm font-semibold text-text-primary mb-1">{activePrompt.title}</h4>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};
