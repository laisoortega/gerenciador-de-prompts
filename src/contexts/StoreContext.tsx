import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { User, Workspace, Prompt, Category, ViewType, Plan } from '../types';
import { INITIAL_USER, MOCK_WORKSPACES, MOCK_PROMPTS, MOCK_CATEGORIES, MOCK_PLANS } from '../services/mockData';

interface StoreContextType {
    user: User | null;
    workspaces: Workspace[];
    prompts: Prompt[];
    categories: Category[];
    plans: Plan[];
    activeWorkspaceId: string;
    isLoading: boolean;
    currentView: ViewType;

    // Auth
    login: (email: string) => void;
    logout: () => void;
    completeOnboarding: (data: Partial<User>) => void;

    // Prompt CRUD
    addPrompt: (prompt: Omit<Prompt, 'id' | 'user_id' | 'copy_count' | 'updated_at' | 'created_at' | 'order_index'>) => void;
    updatePrompt: (id: string, data: Partial<Prompt>) => void;
    deletePrompt: (id: string) => void;
    toggleFavorite: (id: string) => void;
    incrementCopyCount: (id: string) => void;
    movePrompt: (promptId: string, categoryId: string) => void;
    reorderPrompts: (prompts: Prompt[]) => void;

    // Category CRUD
    addCategory: (data: Partial<Category>) => void;
    updateCategory: (id: string, data: Partial<Category>) => void;
    deleteCategory: (id: string) => void;
    toggleCategoryExpand: (id: string) => void;
    moveCategory: (id: string, newParentId: string | null, newIndex: number) => void;

    // Workspace CRUD
    setActiveWorkspaceId: (id: string) => void;
    addWorkspace: (data: Partial<Workspace>) => void;
    updateWorkspace: (id: string, data: Partial<Workspace>) => void;
    deleteWorkspace: (id: string) => void;

    // UI
    setCurrentView: (view: ViewType) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;

    // Data Management
    exportData: () => void;
    importData: (jsonData: string) => void;

    // Helper
    categoryTree: Category[];
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [workspaces, setWorkspaces] = useState<Workspace[]>(MOCK_WORKSPACES);
    const [prompts, setPrompts] = useState<Prompt[]>(MOCK_PROMPTS);
    const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
    const [plans] = useState<Plan[]>(MOCK_PLANS);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [currentView, setCurrentView] = useState<ViewType>('cards');

    useEffect(() => {
        // Simular carregamento inicial
        setTimeout(() => {
            // Tentar recuperar do localStorage
            const storedUser = localStorage.getItem('pm_user');

            if (storedUser) {
                setUser(JSON.parse(storedUser));
                setWorkspaces(MOCK_WORKSPACES);
                setPrompts(MOCK_PROMPTS);
                setCategories(MOCK_CATEGORIES);
                setActiveWorkspaceId(MOCK_WORKSPACES[0].id);
            }
            setIsLoading(false);
        }, 800);
    }, []);

    // --- Auth ---
    const login = (email: string) => {
        setIsLoading(true);
        setTimeout(() => {
            // Mock login - Se tiver admin no email, vira admin
            const role = email.includes('admin') ? 'super_admin' : 'user';
            const newUser = { ...INITIAL_USER, email, role: role as any, name: email.split('@')[0] };
            setUser(newUser);
            setWorkspaces(MOCK_WORKSPACES);
            setPrompts(MOCK_PROMPTS);
            setCategories(MOCK_CATEGORIES);
            setActiveWorkspaceId(MOCK_WORKSPACES[0].id);
            localStorage.setItem('pm_user', JSON.stringify(newUser));
            setIsLoading(false);
        }, 600);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('pm_user');
    };

    const completeOnboarding = (data: Partial<User>) => {
        if (!user) return;
        const updatedUser = { ...user, ...data, onboarding_completed: true };
        setUser(updatedUser);
        localStorage.setItem('pm_user', JSON.stringify(updatedUser));
    };

    // --- Prompts ---
    const addPrompt = (data: Omit<Prompt, 'id' | 'user_id' | 'copy_count' | 'updated_at' | 'created_at' | 'order_index'>) => {
        if (!user) return;
        const newPrompt: Prompt = {
            ...data,
            id: `p-${Date.now()}`,
            user_id: user.id,
            copy_count: 0,
            updated_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            is_favorite: data.is_favorite || false,
            order_index: prompts.length
        };
        setPrompts(prev => [newPrompt, ...prev]);
        // Atualizar contador da categoria
        if (data.category_id) {
            setCategories(prev => prev.map(c => c.id === data.category_id ? { ...c, prompt_count: c.prompt_count + 1 } : c));
        }
        setUser(prev => prev ? { ...prev, prompts_count: prev.prompts_count + 1 } : null);
    };

    const updatePrompt = (id: string, data: Partial<Prompt>) => {
        setPrompts(prev => prev.map(p => p.id === id ? { ...p, ...data, updated_at: new Date().toISOString() } : p));
    };

    const deletePrompt = (id: string) => {
        const prompt = prompts.find(p => p.id === id);
        setPrompts(prev => prev.filter(p => p.id !== id));
        if (prompt?.category_id) {
            setCategories(prev => prev.map(c => c.id === prompt.category_id ? { ...c, prompt_count: Math.max(0, c.prompt_count - 1) } : c));
        }
    };

    const toggleFavorite = (id: string) => {
        setPrompts(prev => prev.map(p => p.id === id ? { ...p, is_favorite: !p.is_favorite } : p));
    };

    const incrementCopyCount = (id: string) => {
        setPrompts(prev => prev.map(p => p.id === id ? { ...p, copy_count: p.copy_count + 1 } : p));
    };

    const movePrompt = (promptId: string, categoryId: string) => {
        const prompt = prompts.find(p => p.id === promptId);
        if (!prompt || prompt.category_id === categoryId) return;
        const oldCat = prompt.category_id;

        setPrompts(prev => prev.map(p => p.id === promptId ? { ...p, category_id: categoryId } : p));

        setCategories(prev => prev.map(c => {
            if (c.id === oldCat) return { ...c, prompt_count: c.prompt_count - 1 };
            if (c.id === categoryId) return { ...c, prompt_count: c.prompt_count + 1 };
            return c;
        }));
    };

    const reorderPrompts = (newPrompts: Prompt[]) => {
        setPrompts(newPrompts.map((p, idx) => ({ ...p, order_index: idx })));
    };

    // --- Categories ---
    const addCategory = (data: Partial<Category>) => {
        const id = `cat-${Date.now()}`;
        const parentPath = data.parent_id
            ? categories.find(c => c.id === data.parent_id)?.path
            : null;

        const newCat: Category = {
            id,
            workspace_id: activeWorkspaceId,
            parent_id: data.parent_id || null,
            name: data.name || 'Nova Categoria',
            slug: (data.name || 'nova').toLowerCase().replace(/\s+/g, '-'),
            color: data.color || '#3b82f6',
            icon: data.icon,
            depth: data.depth || 0,
            path: parentPath ? `${parentPath}/${id}` : id,
            is_expanded: true,
            prompt_count: 0,
            order_index: categories.length,
            children: []
        };
        setCategories(prev => [...prev, newCat]);
        setUser(prev => prev ? { ...prev, categories_count: prev.categories_count + 1 } : null);
    };

    const updateCategory = (id: string, data: Partial<Category>) => {
        setCategories(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    };

    const deleteCategory = (id: string) => {
        // Lógica recursiva para deletar filhos seria ideal aqui
        setCategories(prev => prev.filter(c => c.id !== id && c.parent_id !== id));
    };

    const toggleCategoryExpand = (id: string) => {
        setCategories(prev => prev.map(c => c.id === id ? { ...c, is_expanded: !c.is_expanded } : c));
    };

    const moveCategory = (id: string, newParentId: string | null, _newIndex: number) => {
        setCategories(prev => prev.map(c => c.id === id ? { ...c, parent_id: newParentId } : c));
        // Re-sort logic would go here in a real backend
    };

    // --- Workspaces ---
    const addWorkspace = (data: Partial<Workspace>) => {
        if (!user) return;
        const newWs: Workspace = {
            id: `ws-${Date.now()}`,
            name: data.name || 'Novo Espaço',
            slug: (data.name || 'novo').toLowerCase().replace(/\s+/g, '-'),
            owner_id: user.id,
            is_default: false,
            color: data.color || '#3b82f6',
            description: data.description,
            prompts_count: 0,
            categories_count: 0
        };
        setWorkspaces(prev => [...prev, newWs]);
        setActiveWorkspaceId(newWs.id);
    }

    const updateWorkspace = (id: string, data: Partial<Workspace>) => {
        setWorkspaces(prev => prev.map(w => w.id === id ? { ...w, ...data } : w));
    };

    const deleteWorkspace = (id: string) => {
        setWorkspaces(prev => prev.filter(w => w.id !== id));
        if (activeWorkspaceId === id && workspaces.length > 0) {
            setActiveWorkspaceId(workspaces[0].id);
        }
    };

    // Helper: Constroi a arvore de categorias
    const categoryTree = useMemo(() => {
        const buildTree = (parentId: string | null = null, depth = 0): Category[] => {
            return categories
                .filter(c => c.parent_id === parentId)
                .sort((a, b) => a.order_index - b.order_index)
                .map(c => ({
                    ...c,
                    depth,
                    children: buildTree(c.id, depth + 1)
                }));
        };
        return buildTree();
    }, [categories]);

    const exportData = () => {
        const data = {
            workspaces,
            prompts,
            categories,
            user
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `promptmaster-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const importData = (jsonData: string) => {
        try {
            const data = JSON.parse(jsonData);
            if (data.prompts) setPrompts(data.prompts);
            if (data.categories) setCategories(data.categories);
            if (data.workspaces) setWorkspaces(data.workspaces);
            // User data usually shouldn't be fully overwritten on import if logic is "restore content", 
            // but for full backup restore, we might want to.
            // keeping user separate for now unless specifically requested.
            alert('Dados importados com sucesso!');
        } catch (e) {
            console.error('Falha ao importar dados:', e);
            alert('Erro ao importar arquivo. Verifique se o formato é válido.');
        }
    };

    return (
        <StoreContext.Provider value={{
            user, workspaces, prompts, categories, activeWorkspaceId, isLoading, currentView, plans, searchQuery,
            login, logout, completeOnboarding,
            addPrompt, updatePrompt, deletePrompt, toggleFavorite, incrementCopyCount, movePrompt, reorderPrompts,
            addCategory, updateCategory, deleteCategory, toggleCategoryExpand, moveCategory,
            setActiveWorkspaceId, addWorkspace, updateWorkspace, deleteWorkspace, setCurrentView, setSearchQuery,
            categoryTree,
            exportData, importData
        }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) throw new Error('useStore must be used within StoreProvider');
    return context;
};
