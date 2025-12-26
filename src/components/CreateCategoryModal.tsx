import { useState } from 'react';
import { useStore } from '../contexts/StoreContext';
import { Modal } from './ui/Modal';
import { Sparkles, Palette } from 'lucide-react';

interface CreateCategoryModalProps {
    onClose: () => void;
}

export function CreateCategoryModal({ onClose }: CreateCategoryModalProps) {
    const { addCategory } = useStore();
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('📁');
    const [color, setColor] = useState('#3b82f6');

    const handleSave = () => {
        addCategory({
            name,
            icon,
            color,
            parent_id: null // Top level for now, could add parent selection later
        });
        onClose();
    };

    const icons = ['📁', '📝', '💡', '🔥', '🚀', '💰', '🎯', '📢', '🤖', '🎓'];
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];

    return (
        <Modal size="md" onClose={onClose}>
            <Modal.Header>
                <h2 className="text-xl font-bold text-text-primary">Nova Categoria</h2>
            </Modal.Header>
            <Modal.Body className="space-y-6">
                <div>
                    <label className="label">Nome da Categoria</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-primary w-full"
                        placeholder="Ex: Marketing de Conteúdo"
                        autoFocus
                    />
                </div>

                <div>
                    <label className="label">Ícone</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {icons.map((i) => (
                            <button
                                key={i}
                                onClick={() => setIcon(i)}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${icon === i
                                        ? 'bg-primary-500/20 ring-2 ring-primary-500'
                                        : 'bg-bg-elevated hover:bg-bg-hover border border-border-default'
                                    }`}
                            >
                                {i}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="label">Cor</label>
                    <div className="flex flex-wrap gap-3 mt-2">
                        {colors.map((c) => (
                            <button
                                key={c}
                                onClick={() => setColor(c)}
                                className={`w-8 h-8 rounded-full transition-all ${color === c
                                        ? 'ring-2 ring-offset-2 ring-offset-bg-surface ring-primary-500 scale-110'
                                        : 'hover:scale-110'
                                    }`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button onClick={onClose} className="btn-ghost">Cancelar</button>
                <button
                    onClick={handleSave}
                    disabled={!name}
                    className="btn-primary"
                >
                    Criar Categoria
                </button>
            </Modal.Footer>
        </Modal>
    );
}
