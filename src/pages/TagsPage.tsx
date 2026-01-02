import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { Tag, Trash2, Edit2, ArrowRight, X, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';

export function TagsPage() {
    const navigate = useNavigate();
    const { prompts, updatePrompt, setSelectedTag } = useStore();
    const [editingTag, setEditingTag] = useState<{ oldName: string, newName: string } | null>(null);
    const [deletingTag, setDeletingTag] = useState<string | null>(null);
    const [deleteAction, setDeleteAction] = useState<'remove' | 'replace'>('remove');
    const [replaceWithTag, setReplaceWithTag] = useState<string>('');

    // Extract all unique tags from prompts, sorted alphabetically
    const allTags = useMemo(() => {
        const tagMap = new Map<string, number>();

        prompts.forEach(p => {
            const promptTags = Array.isArray(p.tags) ? p.tags : [];
            promptTags.forEach(tag => {
                tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
            });
        });

        return Array.from(tagMap.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    }, [prompts]);

    // Group tags by first letter
    const groupedTags = useMemo(() => {
        const groups = new Map<string, typeof allTags>();

        allTags.forEach(tag => {
            const firstLetter = tag.name.charAt(0).toUpperCase();
            const letter = /[A-Z]/.test(firstLetter) ? firstLetter : '#';

            if (!groups.has(letter)) {
                groups.set(letter, []);
            }
            groups.get(letter)!.push(tag);
        });

        return Array.from(groups.entries()).sort((a, b) => {
            if (a[0] === '#') return 1;
            if (b[0] === '#') return -1;
            return a[0].localeCompare(b[0]);
        });
    }, [allTags]);

    // Other tags for replacement dropdown
    const otherTags = useMemo(() => {
        if (!deletingTag) return [];
        return allTags.filter(t => t.name !== deletingTag).map(t => t.name);
    }, [allTags, deletingTag]);

    const handleRenameTag = () => {
        if (!editingTag || !editingTag.newName.trim() || editingTag.oldName === editingTag.newName.trim()) {
            setEditingTag(null);
            return;
        }

        const newName = editingTag.newName.trim();
        const oldName = editingTag.oldName;

        // Find prompts that have this tag
        const affectedPrompts = prompts.filter(p => {
            const promptTags = Array.isArray(p.tags) ? p.tags : [];
            return promptTags.includes(oldName);
        });

        // Update each prompt - replace old tag with new, removing duplicates
        affectedPrompts.forEach(prompt => {
            const promptTags = Array.isArray(prompt.tags) ? [...prompt.tags] : [];

            // Find index of old tag and replace it
            const oldIndex = promptTags.indexOf(oldName);
            if (oldIndex !== -1) {
                // Check if new name already exists in the tags
                const newNameExists = promptTags.includes(newName);

                if (newNameExists) {
                    // Just remove the old tag since new already exists
                    promptTags.splice(oldIndex, 1);
                } else {
                    // Replace old with new
                    promptTags[oldIndex] = newName;
                }

                updatePrompt(prompt.id, { tags: promptTags });
            }
        });

        setEditingTag(null);
    };

    const handleDeleteTag = () => {
        if (!deletingTag) return;

        const tagToDelete = deletingTag;
        const replacement = deleteAction === 'replace' ? replaceWithTag : null;

        // Find prompts that have this tag
        const affectedPrompts = prompts.filter(p => {
            const promptTags = Array.isArray(p.tags) ? p.tags : [];
            return promptTags.includes(tagToDelete);
        });

        // Update each prompt
        affectedPrompts.forEach(prompt => {
            const promptTags = Array.isArray(prompt.tags) ? [...prompt.tags] : [];
            const tagIndex = promptTags.indexOf(tagToDelete);

            if (tagIndex !== -1) {
                if (replacement && !promptTags.includes(replacement)) {
                    // Replace with another tag (only if it doesn't already exist)
                    promptTags[tagIndex] = replacement;
                } else {
                    // Just remove
                    promptTags.splice(tagIndex, 1);
                }

                updatePrompt(prompt.id, { tags: promptTags });
            }
        });

        // Reset state
        setDeletingTag(null);
        setDeleteAction('remove');
        setReplaceWithTag('');
    };

    const openDeleteModal = (tagName: string) => {
        setDeletingTag(tagName);
        setDeleteAction('remove');
        // Set first available tag as default replacement
        const other = allTags.filter(t => t.name !== tagName);
        setReplaceWithTag(other.length > 0 ? other[0].name : '');
    };

    const tagCount = allTags.find(t => t.name === deletingTag)?.count || 0;

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Tags</h1>
                    <p className="text-text-muted mt-1">
                        {allTags.length} tags em {prompts.length} prompts
                    </p>
                </div>
            </div>

            {allTags.length === 0 ? (
                <div className="text-center py-16 bg-bg-surface rounded-xl border border-border-subtle">
                    <Tag className="w-12 h-12 text-text-muted mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Nenhuma tag encontrada</h3>
                    <p className="text-text-muted">
                        As tags são criadas automaticamente quando você adiciona tags aos seus prompts.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {groupedTags.map(([letter, tags]) => (
                        <div key={letter}>
                            {/* Letter Header */}
                            <div className="flex items-center gap-3 mb-3">
                                <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-bg-elevated text-text-muted font-bold text-sm">
                                    {letter}
                                </span>
                                <div className="flex-1 h-px bg-border-subtle" />
                                <span className="text-xs text-text-muted">{tags.length}</span>
                            </div>

                            {/* Tags Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {tags.map(tag => (
                                    <div
                                        key={tag.name}
                                        className="group flex items-center justify-between px-4 py-3 bg-bg-surface rounded-lg border border-border-subtle hover:border-border-default transition-colors"
                                    >
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <button
                                                onClick={() => {
                                                    setSelectedTag(tag.name);
                                                    navigate('/');
                                                }}
                                                className="font-medium text-text-primary truncate hover:text-primary-400 transition-colors text-left"
                                                title={`Ver ${tag.count} prompts com esta tag`}
                                            >
                                                {tag.name}
                                            </button>
                                            <span className="text-xs text-text-muted whitespace-nowrap">
                                                {tag.count}
                                            </span>
                                            <ExternalLink className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-50" />
                                        </div>

                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => setEditingTag({ oldName: tag.name, newName: tag.name })}
                                                className="p-1.5 hover:bg-bg-hover rounded text-text-muted hover:text-text-primary transition-colors"
                                                title="Renomear"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(tag.name)}
                                                className="p-1.5 hover:bg-error-500/10 rounded text-text-muted hover:text-error-500 transition-colors"
                                                title="Excluir"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Rename Modal - Using subcomponents pattern */}
            {editingTag && (
                <Modal size="sm" onClose={() => setEditingTag(null)}>
                    <Modal.Header>
                        <h2 className="text-xl font-bold text-text-primary">Renomear Tag</h2>
                        <button
                            onClick={() => setEditingTag(null)}
                            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </Modal.Header>
                    <Modal.Body className="space-y-4">
                        <Input
                            label="Novo nome da tag"
                            value={editingTag.newName}
                            onChange={(e) => setEditingTag({ ...editingTag, newName: e.target.value })}
                            placeholder="Digite o novo nome"
                            autoFocus
                        />
                        <p className="text-xs text-text-muted">
                            Esta tag será renomeada em todos os prompts que a utilizam.
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="flex justify-end gap-3 w-full">
                            <Button variant="ghost" onClick={() => setEditingTag(null)}>
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleRenameTag}
                                disabled={!editingTag.newName.trim() || editingTag.newName.trim() === editingTag.oldName}
                            >
                                Renomear
                            </Button>
                        </div>
                    </Modal.Footer>
                </Modal>
            )}

            {/* Delete Modal - Using subcomponents pattern */}
            {deletingTag && (
                <Modal size="md" onClose={() => setDeletingTag(null)}>
                    <Modal.Header>
                        <h2 className="text-xl font-bold text-text-primary">Excluir Tag</h2>
                        <button
                            onClick={() => setDeletingTag(null)}
                            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </Modal.Header>
                    <Modal.Body className="space-y-4">
                        <p className="text-text-secondary">
                            A tag <strong className="text-text-primary">"{deletingTag}"</strong> está em <strong>{tagCount}</strong> {tagCount === 1 ? 'prompt' : 'prompts'}.
                        </p>

                        {/* Action Options */}
                        <div className="space-y-3">
                            {/* Option 1: Just remove */}
                            <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${deleteAction === 'remove'
                                ? 'border-primary-500 bg-primary-500/5'
                                : 'border-border-default hover:border-border-hover'
                                }`}>
                                <input
                                    type="radio"
                                    name="deleteAction"
                                    value="remove"
                                    checked={deleteAction === 'remove'}
                                    onChange={() => setDeleteAction('remove')}
                                    className="mt-0.5"
                                />
                                <div>
                                    <span className="font-medium text-text-primary">Apenas remover a tag</span>
                                    <p className="text-sm text-text-muted mt-0.5">
                                        A tag será removida dos prompts, sem substituição.
                                    </p>
                                </div>
                            </label>

                            {/* Option 2: Replace with another */}
                            {otherTags.length > 0 && (
                                <label className={`block p-4 rounded-xl border cursor-pointer transition-all ${deleteAction === 'replace'
                                    ? 'border-primary-500 bg-primary-500/5'
                                    : 'border-border-default hover:border-border-hover'
                                    }`}>
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="radio"
                                            name="deleteAction"
                                            value="replace"
                                            checked={deleteAction === 'replace'}
                                            onChange={() => setDeleteAction('replace')}
                                            className="mt-0.5"
                                        />
                                        <div className="flex-1">
                                            <span className="font-medium text-text-primary">Substituir por outra tag</span>
                                            <p className="text-sm text-text-muted mt-0.5">
                                                A tag será substituída por outra tag existente.
                                            </p>
                                        </div>
                                    </div>

                                    {deleteAction === 'replace' && (
                                        <div className="mt-3 ml-6 flex items-center gap-2">
                                            <span className="text-sm text-text-muted">"{deletingTag}"</span>
                                            <ArrowRight className="w-4 h-4 text-text-muted" />
                                            <select
                                                value={replaceWithTag}
                                                onChange={(e) => setReplaceWithTag(e.target.value)}
                                                className="flex-1 px-3 py-2 bg-bg-elevated border border-border-default rounded-lg text-sm text-text-primary"
                                            >
                                                {otherTags.map(tag => (
                                                    <option key={tag} value={tag}>{tag}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </label>
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="flex justify-end gap-3 w-full">
                            <Button variant="ghost" onClick={() => setDeletingTag(null)}>
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleDeleteTag}
                                className="bg-error-500 hover:bg-error-600"
                            >
                                Excluir Tag
                            </Button>
                        </div>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
}

export default TagsPage;
