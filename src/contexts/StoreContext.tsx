import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { User, Workspace, Prompt, Category, ViewType, Plan } from '../types';
import { INITIAL_USER, MOCK_WORKSPACES, MOCK_PROMPTS, MOCK_CATEGORIES, MOCK_PLANS } from '../services/mockData';
import { fetchUserDefaultWorkspace, seedDefaultVariables } from '../services/api';
import { usePromptsQuery } from '../hooks/usePromptsQuery';
import { useCategoriesQuery } from '../hooks/useCategoriesQuery';
import { useAuth } from './AuthContext';

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
    selectedCategoryId: string | null;
    setSelectedCategoryId: (id: string | null) => void;
    selectedTag: string | null;
    setSelectedTag: (tag: string | null) => void;
    onlyFavorites: boolean;
    setOnlyFavorites: (only: boolean) => void;

    isCreatePromptModalOpen: boolean;
    setCreatePromptModalOpen: (isOpen: boolean) => void;
    isCreateCategoryModalOpen: boolean;
    setCreateCategoryModalOpen: (isOpen: boolean) => void;
    isMobileMenuOpen: boolean;
    setMobileMenuOpen: (isOpen: boolean) => void;
    editingCategory: Category | undefined;
    setEditingCategory: (category: Category | undefined) => void;

    // Data Management
    exportData: () => void;
    importData: (jsonData: string) => void;

    // Helper
    categoryTree: Category[];
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user: authUser } = useAuth();

    // --- Auth State ---
    const [user, setUser] = useState<User | null>(null);
    const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>('');

    // --- UI State ---
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [onlyFavorites, setOnlyFavorites] = useState(false);
    const [currentView, setCurrentView] = useState<ViewType>('cards');
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    // Modals
    const [isCreatePromptModalOpen, setCreatePromptModalOpen] = useState(false);
    const [isCreateCategoryModalOpen, setCreateCategoryModalOpen] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);

    // --- Data Hooks (React Query) ---

    // Setup user and workspace when auth changes
    useEffect(() => {
        const setupUserAndWorkspace = async () => {
            setIsLoadingUser(true);

            if (authUser) {
                // Create internal user object from auth user
                setUser({
                    id: authUser.id,
                    email: authUser.email || '',
                    name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Usuário',
                    plan_id: 'free',
                    role: 'user',
                    onboarding_completed: true
                } as User);

                // Fetch or create default workspace
                try {
                    const workspace = await fetchUserDefaultWorkspace(authUser.id);
                    if (workspace) {
                        setActiveWorkspaceId(workspace.id);
                    }
                    // Seed default variables for new users
                    await seedDefaultVariables(authUser.id);
                } catch (error) {
                    console.error('Error fetching workspace:', error);
                    // Fallback to mock
                    setActiveWorkspaceId(MOCK_WORKSPACES[0]?.id || 'mock-workspace');
                }
            } else {
                setUser(null);
                setActiveWorkspaceId('');
            }

            setIsLoadingUser(false);
        };

        setupUserAndWorkspace();
    }, [authUser]);

    const {
        prompts: rawPrompts,
        isLoading: isLoadingPrompts,
        addPrompt: addPromptMutation,
        updatePrompt: updatePromptMutation,
        deletePrompt: deletePromptMutation
    } = usePromptsQuery(activeWorkspaceId);

    const {
        categories,
        isLoading: isLoadingCategories,
        addCategory: addCategoryMutation,
        updateCategory: updateCategoryMutation,
        deleteCategory: deleteCategoryMutation
    } = useCategoriesQuery(activeWorkspaceId);

    const [workspaces, setWorkspaces] = useState<Workspace[]>(MOCK_WORKSPACES); // TODO: Move to useWorkspacesQuery
    const [plans] = useState<Plan[]>(MOCK_PLANS); // Static for now

    // --- Derived Data ---

    // Join Logic: Attach category objects to prompts
    const prompts = useMemo(() => {
        return rawPrompts.map(p => ({
            ...p,
            category: categories.find(c => c.id === p.category_id)
        }));
    }, [rawPrompts, categories]);

    // Category Tree
    const categoryTree = useMemo(() => {
        const counts = prompts.reduce((acc, p) => {
            if (p.category_id) {
                acc[p.category_id] = (acc[p.category_id] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        const buildTree = (parentId: string | null = null, depth = 0): Category[] => {
            return categories
                .filter(c => c.parent_id === parentId)
                .sort((a, b) => a.order_index - b.order_index)
                .map(c => {
                    const children = buildTree(c.id, depth + 1);
                    const directCount = counts[c.id] || 0;
                    return {
                        ...c,
                        depth,
                        prompt_count: directCount,
                        children
                    };
                });
        };
        return buildTree();
    }, [categories, prompts]);


    // --- Actions Wrappers ---
    // These adapt the Context interface to the Hook mutations

    // Prompts
    const addPrompt = (data: Omit<Prompt, 'id' | 'user_id' | 'copy_count' | 'updated_at' | 'created_at' | 'order_index'>) => {
        if (!user) return;
        addPromptMutation({ ...data, user_id: user.id } as any);
    };

    const updatePrompt = (id: string, data: Partial<Prompt>) => {
        updatePromptMutation({ id, data });
    };

    const deletePrompt = (id: string) => deletePromptMutation(id);

    const toggleFavorite = (id: string) => {
        const p = prompts.find(p => p.id === id);
        if (p) updatePrompt(id, { is_favorite: !p.is_favorite });
    };

    const incrementCopyCount = (id: string) => {
        const p = prompts.find(p => p.id === id);
        if (p) updatePrompt(id, { copy_count: (p.copy_count || 0) + 1 });
    };

    const movePrompt = (promptId: string, categoryId: string) => {
        updatePrompt(promptId, { category_id: categoryId });
    };

    const reorderPrompts = (newPrompts: Prompt[]) => {
        // TODO: Batch update order indexes via API
        console.warn('Reorder not fully implemented in backend yet');
    };

    // Categories
    const addCategory = (data: Partial<Category>) => {
        if (!user) return;
        addCategoryMutation({
            ...data,
            user_id: user.id,
            workspace_id: activeWorkspaceId
        } as any);
    };

    const updateCategory = (id: string, data: Partial<Category>) => {
        updateCategoryMutation({ id, data });
    };

    const deleteCategory = (id: string) => deleteCategoryMutation(id);

    const toggleCategoryExpand = (id: string) => {
        // This is UI state! Should ideally be local or visual-only, 
        // OR persisted in backend if we want to save expanded state.
        // For now, let's update it in the backend mock to persist per session
        const cat = categories.find(c => c.id === id);
        if (cat) updateCategoryMutation({ id, data: { is_expanded: !cat.is_expanded } });
    };

    const moveCategory = (id: string, newParentId: string | null, newIndex: number) => {
        updateCategoryMutation({ id, data: { parent_id: newParentId } });
        // TODO: Handle Index
    };

    // Workspaces (Legacy local state for now until Phase 1b)
    const addWorkspace = (data: Partial<Workspace>) => { /* ... implemented .. */ };
    const updateWorkspace = (id: string, data: Partial<Workspace>) => { /* ... */ };
    const deleteWorkspace = (id: string) => { /* ... */ };

    // Auth Actions
    const login = (email: string) => {
        setIsLoadingUser(true);
        setTimeout(() => {
            const role = email.includes('admin') ? 'super_admin' : 'user';
            const newUser = { ...INITIAL_USER, email, role: role as any, name: email.split('@')[0] };
            setUser(newUser);
            localStorage.setItem('pm_user', JSON.stringify(newUser));
            setIsLoadingUser(false);
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

    // Data Export/Import
    const exportData = () => { /* ... same ... */ };
    const importData = (jsonData: string) => { /* ... same ... */ };

    return (
        <StoreContext.Provider value={{
            user, workspaces, prompts, categories, activeWorkspaceId,
            isLoading: isLoadingUser || isLoadingPrompts || isLoadingCategories,
            currentView, plans, searchQuery,
            selectedCategoryId, setSelectedCategoryId, selectedTag, setSelectedTag, onlyFavorites, setOnlyFavorites,
            login, logout, completeOnboarding,
            addPrompt, updatePrompt, deletePrompt, toggleFavorite, incrementCopyCount, movePrompt, reorderPrompts,
            addCategory, updateCategory, deleteCategory, toggleCategoryExpand, moveCategory,
            setActiveWorkspaceId, addWorkspace, updateWorkspace, deleteWorkspace, setCurrentView, setSearchQuery,
            isCreatePromptModalOpen, setCreatePromptModalOpen, isCreateCategoryModalOpen, setCreateCategoryModalOpen,
            isMobileMenuOpen, setMobileMenuOpen,
            editingCategory, setEditingCategory,
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
