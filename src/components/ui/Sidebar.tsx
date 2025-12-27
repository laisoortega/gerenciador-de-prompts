import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '../../contexts/StoreContext';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Settings, LogOut, LayoutGrid, LayoutList, Kanban, FolderTree, Share2, Inbox, Braces } from 'lucide-react';
import { fetchSharedWithMe } from '../../services/api';
import { SimpleCategoryList } from '../sidebar/SimpleCategoryList';
import { Button } from './Button';

export const Sidebar: React.FC = () => {
    const { categoryTree, currentView, setCurrentView, user, setCreateCategoryModalOpen, selectedCategoryId, setSelectedCategoryId } = useStore();
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Query for shared counts
    const { data: sharedData } = useQuery({
        queryKey: ['shared-with-me-count'],
        queryFn: () => fetchSharedWithMe({}),
        staleTime: 60000,
    });

    const sharedCount = (sharedData?.activeCount || 0) + (sharedData?.pendingCount || 0);

    const handleViewChange = (view: any) => {
        if (location.pathname !== '/') {
            navigate('/');
        }
        setCurrentView(view);
    };

    const isActiveView = (view: string) => location.pathname === '/' && currentView === view;

    return (
        <aside className="w-64 bg-bg-surface border-r border-border-subtle h-screen flex flex-col">
            {/* Logo */}
            <div className="h-16 flex items-center px-4 border-b border-border-default cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold mr-3 shadow-lg shadow-primary-500/20">P</div>
                <span className="font-bold text-lg text-text-primary tracking-tight">PromptMaster</span>
            </div>

            {/* Views Navigation */}
            <div className="p-3 border-b border-border-subtle">
                <p className="px-2 text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Visualização</p>
                <div className="space-y-1">
                    <Button
                        variant={isActiveView('cards') ? 'primary' : 'ghost'}
                        onClick={() => handleViewChange('cards')}
                        className={`w-full justify-start gap-3 ${isActiveView('cards') ? 'bg-primary-500/10 text-primary-500 hover:bg-primary-500/20 shadow-none' : 'text-text-secondary'}`}
                    >
                        <LayoutGrid className="w-4 h-4" /> Cards
                    </Button>

                    <Button
                        variant={isActiveView('table') ? 'primary' : 'ghost'}
                        onClick={() => handleViewChange('table')}
                        className={`w-full justify-start gap-3 ${isActiveView('table') ? 'bg-primary-500/10 text-primary-500 hover:bg-primary-500/20 shadow-none' : 'text-text-secondary'}`}
                    >
                        <LayoutList className="w-4 h-4" /> Lista
                    </Button>

                    <Button
                        variant={isActiveView('kanban') ? 'primary' : 'ghost'}
                        onClick={() => handleViewChange('kanban')}
                        className={`w-full justify-start gap-3 ${isActiveView('kanban') ? 'bg-primary-500/10 text-primary-500 hover:bg-primary-500/20 shadow-none' : 'text-text-secondary'}`}
                    >
                        <Kanban className="w-4 h-4" /> Kanban
                    </Button>

                    <Button
                        variant={isActiveView('folders') ? 'primary' : 'ghost'}
                        onClick={() => handleViewChange('folders')}
                        className={`w-full justify-start gap-3 ${isActiveView('folders') ? 'bg-primary-500/10 text-primary-500 hover:bg-primary-500/20 shadow-none' : 'text-text-secondary'}`}
                    >
                        <FolderTree className="w-4 h-4" /> Pastas
                    </Button>
                </div>
            </div>

            {/* Shared Navigation */}
            <div className="p-3 border-b border-border-subtle">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/shared-with-me')}
                    className={`w-full justify-between ${location.pathname === '/shared-with-me' ? 'bg-primary-500/10 text-primary-500' : 'text-text-secondary'}`}
                >
                    <div className="flex items-center gap-3">
                        <Share2 className="w-4 h-4" /> Compartilhados
                    </div>
                    {sharedCount > 0 && (
                        <span className="bg-primary-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium min-w-[18px] text-center">
                            {sharedCount}
                        </span>
                    )}
                </Button>
            </div>

            {/* Variables Quick Access */}
            <div className="p-3 border-b border-border-subtle">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/settings/variables')}
                    className={`w-full justify-start gap-3 ${location.pathname === '/settings/variables' ? 'bg-primary-500/10 text-primary-500' : 'text-text-secondary'}`}
                >
                    <Braces className="w-4 h-4" /> Minhas Variáveis
                </Button>
            </div>

            {/* Categories Tree */}
            <div className="flex-1 overflow-y-auto p-3">
                <div className="flex items-center justify-between px-2 mb-2">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Categorias</p>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCreateCategoryModalOpen(true)}
                        className="h-6 w-6 text-text-muted hover:text-primary-500"
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                {/* Todos - All Prompts */}
                <Button
                    variant={selectedCategoryId === null ? 'primary' : 'ghost'}
                    onClick={() => setSelectedCategoryId(null)}
                    className={`w-full justify-start gap-3 mb-2 ${selectedCategoryId === null ? 'bg-primary-500/10 text-primary-500 hover:bg-primary-500/20 shadow-none' : 'text-text-secondary'}`}
                >
                    <Inbox className="w-4 h-4" /> Todos
                </Button>

                <SimpleCategoryList categories={categoryTree} />
            </div>

            {/* User Footer */}
            <div className="p-4 border-t border-border-subtle bg-bg-surface">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/20">
                        {user?.name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{user?.name}</p>
                        <button
                            onClick={() => navigate('/subscription')}
                            className="text-xs text-primary-500 hover:text-primary-400 font-medium truncate hover:underline"
                        >
                            {user?.plan_id.toUpperCase()}
                        </button>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/settings')}
                        className="flex-1 gap-2 border-border-default hover:bg-bg-hover text-text-secondary"
                    >
                        <Settings className="w-3.5 h-3.5" /> Config
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={signOut}
                        className="flex-1 gap-2 text-text-secondary hover:bg-error-500/10 hover:text-error-500"
                    >
                        <LogOut className="w-3.5 h-3.5" /> Sair
                    </Button>
                </div>
            </div>
        </aside>
    );
};
