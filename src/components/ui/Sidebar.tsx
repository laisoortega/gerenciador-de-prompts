import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '../../contexts/StoreContext';
import { Plus, Settings, LogOut, LayoutGrid, LayoutList, Kanban, FolderTree, Share2 } from 'lucide-react';
import { fetchSharedWithMe } from '../../services/api';
import { CategoryTree } from '../sidebar/CategoryTree';

export const Sidebar: React.FC = () => {
    const { categoryTree, currentView, setCurrentView, logout, user, toggleCategoryExpand, moveCategory } = useStore();
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

    return (
        <aside className="w-64 bg-bg-surface border-r border-border-subtle h-screen flex flex-col">
            {/* Logo */}
            <div className="h-16 flex items-center px-4 border-b border-border-default cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">P</div>
                <span className="font-bold text-lg text-text-primary">PromptMaster</span>
            </div>

            {/* Views Navigation */}
            <div className="p-3 border-b border-border-subtle">
                <p className="px-2 text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Visualização</p>
                <div className="space-y-1">
                    <button
                        onClick={() => handleViewChange('cards')}
                        className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm ${location.pathname === '/' && currentView === 'cards' ? 'bg-[#3b82f61a] text-primary-500' : 'text-text-secondary hover:bg-bg-hover'}`}
                    >
                        <LayoutGrid className="w-4 h-4" /> Cards
                    </button>
                    <button
                        onClick={() => handleViewChange('table')}
                        className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm ${location.pathname === '/' && currentView === 'table' ? 'bg-[#3b82f61a] text-primary-500' : 'text-text-secondary hover:bg-bg-hover'}`}
                    >
                        <LayoutList className="w-4 h-4" /> Tabela
                    </button>
                    <button
                        onClick={() => handleViewChange('kanban')}
                        className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm ${location.pathname === '/' && currentView === 'kanban' ? 'bg-[#3b82f61a] text-primary-500' : 'text-text-secondary hover:bg-bg-hover'}`}
                    >
                        <Kanban className="w-4 h-4" /> Kanban
                    </button>
                    <button
                        onClick={() => handleViewChange('folders')}
                        className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm ${location.pathname === '/' && currentView === 'folders' ? 'bg-[#3b82f61a] text-primary-500' : 'text-text-secondary hover:bg-bg-hover'}`}
                    >
                        <FolderTree className="w-4 h-4" /> Pastas
                    </button>
                </div>
            </div>

            {/* Shared Navigation */}
            <div className="p-3 border-b border-border-subtle">
                <button
                    onClick={() => navigate('/shared-with-me')}
                    className={`w-full flex items-center justify-between px-2 py-2 rounded-md text-sm ${location.pathname === '/shared-with-me' ? 'bg-[#3b82f61a] text-primary-500' : 'text-text-secondary hover:bg-bg-hover'}`}
                >
                    <div className="flex items-center gap-3">
                        <Share2 className="w-4 h-4" /> Compartilhados comigo
                    </div>
                    {sharedCount > 0 && (
                        <span className="bg-primary-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                            {sharedCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Categories Tree */}
            <div className="flex-1 overflow-y-auto p-3">
                <div className="flex items-center justify-between px-2 mb-2">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Categorias</p>
                    <button className="text-text-muted hover:text-primary-500"><Plus className="w-4 h-4" /></button>
                </div>
                <CategoryTree
                    categories={categoryTree}
                    onToggleExpand={toggleCategoryExpand}
                    onMoveCategory={moveCategory}
                />
            </div>

            {/* User Footer */}
            <div className="p-4 border-t border-border-subtle">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-accent-500 flex items-center justify-center text-white font-bold">
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
                    <button
                        onClick={() => navigate('/settings')}
                        className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md border border-border-default text-xs font-medium text-text-secondary hover:bg-bg-hover transition-colors"
                    >
                        <Settings className="w-3 h-3" /> Config
                    </button>
                    <button onClick={logout} className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md border border-border-default text-xs font-medium text-text-secondary hover:bg-[#ef44441a] hover:text-error-500 transition-colors">
                        <LogOut className="w-3 h-3" /> Sair
                    </button>
                </div>
            </div>
        </aside>
    );
};
