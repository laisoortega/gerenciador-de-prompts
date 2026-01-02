import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MainLayout } from '../components/layout';
import { SearchBar, TagFilter, PromptCard } from '../components/prompts';
import { Button, Modal, Input, Textarea } from '../components/ui';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Prompt {
    id: string;
    title: string;
    content: string;
    tags: string[];
    is_favorite: boolean;
    copy_count: number;
    created_at: string;
    updated_at: string;
}

// Fetch prompts from Supabase
const fetchPrompts = async (userId: string): Promise<Prompt[]> => {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
};

export const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);

    // Form state
    const [formTitle, setFormTitle] = useState('');
    const [formContent, setFormContent] = useState('');
    const [formTags, setFormTags] = useState('');

    // Queries
    const { data: prompts = [], isLoading } = useQuery({
        queryKey: ['prompts', user?.id],
        queryFn: () => fetchPrompts(user?.id || ''),
        enabled: !!user?.id,
    });

    // Extract unique tags from all prompts
    const allTags = useMemo(() => {
        const tagSet = new Set<string>();
        prompts.forEach(prompt => {
            (prompt.tags || []).forEach(tag => tagSet.add(tag));
        });
        return Array.from(tagSet).sort();
    }, [prompts]);

    // Filter prompts
    const filteredPrompts = useMemo(() => {
        return prompts.filter(prompt => {
            // Search filter
            const matchesSearch = !searchQuery ||
                prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (prompt.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

            // Tag filter
            const matchesTag = !selectedTag || (prompt.tags || []).includes(selectedTag);

            return matchesSearch && matchesTag;
        });
    }, [prompts, searchQuery, selectedTag]);

    // Mutations
    const createMutation = useMutation({
        mutationFn: async (data: { title: string; content: string; tags: string[] }) => {
            if (!supabase || !user) throw new Error('Not authenticated');

            const { data: newPrompt, error } = await supabase
                .from('prompts')
                .insert({
                    user_id: user.id,
                    title: data.title,
                    content: data.content,
                    tags: data.tags,
                    is_favorite: false,
                    copy_count: 0,
                })
                .select()
                .single();

            if (error) throw error;
            return newPrompt;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prompts'] });
            handleCloseModal();
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, ...data }: { id: string; title?: string; content?: string; tags?: string[]; is_favorite?: boolean }) => {
            if (!supabase) throw new Error('Not configured');

            const { error } = await supabase
                .from('prompts')
                .update({ ...data, updated_at: new Date().toISOString() })
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prompts'] });
            handleCloseModal();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            if (!supabase) throw new Error('Not configured');

            const { error } = await supabase
                .from('prompts')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prompts'] });
        },
    });

    const incrementCopyCount = useMutation({
        mutationFn: async (id: string) => {
            if (!supabase) return;

            const prompt = prompts.find(p => p.id === id);
            if (!prompt) return;

            await supabase
                .from('prompts')
                .update({ copy_count: (prompt.copy_count || 0) + 1 })
                .eq('id', id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prompts'] });
        },
    });

    // Handlers
    const handleOpenCreate = () => {
        setFormTitle('');
        setFormContent('');
        setFormTags('');
        setEditingPrompt(null);
        setIsCreateModalOpen(true);
    };

    const handleOpenEdit = (prompt: Prompt) => {
        setFormTitle(prompt.title);
        setFormContent(prompt.content);
        setFormTags((prompt.tags || []).join(', '));
        setEditingPrompt(prompt);
        setIsCreateModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsCreateModalOpen(false);
        setEditingPrompt(null);
    };

    const handleSubmit = () => {
        const tags = formTags
            .split(',')
            .map(t => t.trim())
            .filter(t => t.length > 0);

        if (editingPrompt) {
            updateMutation.mutate({
                id: editingPrompt.id,
                title: formTitle,
                content: formContent,
                tags,
            });
        } else {
            createMutation.mutate({
                title: formTitle,
                content: formContent,
                tags,
            });
        }
    };

    const handleToggleFavorite = (prompt: Prompt) => {
        updateMutation.mutate({
            id: prompt.id,
            is_favorite: !prompt.is_favorite,
        });
    };

    return (
        <MainLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                        Meus Prompts
                    </h1>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">
                        {filteredPrompts.length} {filteredPrompts.length === 1 ? 'prompt' : 'prompts'}
                    </p>
                </div>

                <Button onClick={handleOpenCreate}>
                    + Novo Prompt
                </Button>
            </div>

            {/* Search & Filters */}
            <div className="space-y-4 mb-6">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Buscar por título, conteúdo ou tags..."
                />

                {allTags.length > 0 && (
                    <TagFilter
                        tags={allTags}
                        selectedTag={selectedTag}
                        onSelectTag={setSelectedTag}
                    />
                )}
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--color-accent)] border-t-transparent" />
                </div>
            ) : filteredPrompts.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-bg-surface)] flex items-center justify-center">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2">
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                            <polyline points="14,2 14,8 20,8" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
                        {searchQuery || selectedTag ? 'Nenhum prompt encontrado' : 'Nenhum prompt ainda'}
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)] mb-4">
                        {searchQuery || selectedTag
                            ? 'Tente ajustar seus filtros de busca'
                            : 'Crie seu primeiro prompt para começar'}
                    </p>
                    {!searchQuery && !selectedTag && (
                        <Button onClick={handleOpenCreate}>
                            + Criar Prompt
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPrompts.map(prompt => (
                        <PromptCard
                            key={prompt.id}
                            prompt={prompt}
                            onCopy={() => incrementCopyCount.mutate(prompt.id)}
                            onEdit={() => handleOpenEdit(prompt)}
                            onDelete={() => deleteMutation.mutate(prompt.id)}
                            onToggleFavorite={() => handleToggleFavorite(prompt)}
                        />
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={handleCloseModal}
                title={editingPrompt ? 'Editar Prompt' : 'Novo Prompt'}
                size="lg"
                footer={
                    <>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            loading={createMutation.isPending || updateMutation.isPending}
                            disabled={!formTitle.trim() || !formContent.trim()}
                        >
                            {editingPrompt ? 'Salvar' : 'Criar'}
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <Input
                        label="Título"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="Ex: Prompt para criar copy de vendas"
                    />

                    <Textarea
                        label="Conteúdo do Prompt"
                        value={formContent}
                        onChange={(e) => setFormContent(e.target.value)}
                        placeholder="Digite seu prompt aqui..."
                        rows={6}
                    />

                    <Input
                        label="Tags (separadas por vírgula)"
                        value={formTags}
                        onChange={(e) => setFormTags(e.target.value)}
                        placeholder="Ex: copywriting, vendas, marketing"
                    />
                </div>
            </Modal>
        </MainLayout>
    );
};

export default Dashboard;
