import { useState } from 'react';
import { useStore } from '../contexts/StoreContext';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { ChevronDown } from 'lucide-react';

interface CreateCategoryModalProps {
    onClose: () => void;
}

// Helper to get category depth (max 3 levels: 0, 1, 2)
function getCategoryDepth(categoryId: string | null, categories: any[]): number {
    if (!categoryId) return 0;
    const cat = categories.find(c => c.id === categoryId);
    if (!cat || !cat.parent_id) return 1;
    return 1 + getCategoryDepth(cat.parent_id, categories);
}

export function CreateCategoryModal({ onClose }: CreateCategoryModalProps) {
    const { addCategory, updateCategory, editingCategory, setEditingCategory, categories } = useStore();
    const [name, setName] = useState(editingCategory?.name || '');
    const [icon, setIcon] = useState(editingCategory?.icon || '📁');
    const [color, setColor] = useState(editingCategory?.color || '#3b82f6');
    const [parentId, setParentId] = useState<string | null>(editingCategory?.parent_id || null);

    // Only allow categories that would result in max 3 levels total
    const availableParents = categories.filter(c => {
        const depth = getCategoryDepth(c.id, categories);
        return depth < 2 && c.id !== editingCategory?.id; // Max 2 levels deep (so child = level 3)
    });

    const handleClose = () => {
        setEditingCategory(undefined);
        onClose();
    };

    const handleSave = () => {
        if (editingCategory) {
            updateCategory(editingCategory.id, {
                name,
                icon,
                color,
                parent_id: parentId
            });
        } else {
            addCategory({
                name,
                icon,
                color,
                parent_id: parentId
            });
        }
        handleClose();
    };

    const icons = ['📁', '📝', '💡', '🔥', '🚀', '💰', '🎯', '📢', '🤖', '🎓'];
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];

    return (
        <Modal size="md" onClose={handleClose}>
            <Modal.Header>
                <h2 className="text-xl font-bold text-text-primary">
                    {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                </h2>
            </Modal.Header>
            <Modal.Body className="space-y-6">
                <Input
                    label="Nome da Categoria"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Marketing de Conteúdo"
                    autoFocus
                />

                {/* Parent Category Selector */}
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Categoria Pai (opcional)</label>
                    <div className="relative">
                        <select
                            value={parentId || ''}
                            onChange={(e) => setParentId(e.target.value || null)}
                            className="appearance-none w-full pl-3 pr-8 py-2.5 bg-bg-base border border-border-default rounded-xl text-sm text-text-primary hover:border-primary-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all cursor-pointer"
                        >
                            <option value="">Nenhuma (categoria raiz)</option>
                            {availableParents.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.icon} {cat.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                    </div>
                    <p className="text-xs text-text-muted mt-1.5 ml-1">Máximo 3 níveis de hierarquia</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Ícone</label>
                    <div className="flex flex-wrap gap-2">
                        {icons.map((i) => (
                            <button
                                key={i}
                                onClick={() => setIcon(i)}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${icon === i
                                    ? 'bg-primary-500/20 ring-2 ring-primary-500 scale-105'
                                    : 'bg-bg-elevated hover:bg-bg-hover border border-border-default'
                                    }`}
                            >
                                {i}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Cor</label>
                    <div className="flex flex-wrap gap-3">
                        {colors.map((c) => (
                            <button
                                key={c}
                                onClick={() => setColor(c)}
                                className={`w-8 h-8 rounded-full transition-all ${color === c
                                    ? 'ring-2 ring-offset-2 ring-offset-bg-surface ring-primary-500 scale-110'
                                    : 'hover:scale-110 hover:ring-2 hover:ring-offset-2 hover:ring-offset-bg-surface hover:ring-border-default'
                                    }`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="flex justify-end gap-3 w-full">
                    <Button variant="ghost" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={!name}>
                        {editingCategory ? 'Salvar Alterações' : 'Criar Categoria'}
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
}
