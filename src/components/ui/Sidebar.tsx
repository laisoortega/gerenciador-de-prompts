import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '../contexts/StoreContext';
import { ChevronRight, ChevronDown, Folder, Plus, Settings, LogOut, LayoutGrid, LayoutList, Kanban, FolderTree, Share2 } from 'lucide-react';
import { Category } from '../types';
import { fetchSharedWithMe } from '../services/api';

export const Sidebar: React.FC = () => {
    const { categoryTree, currentView, setCurrentView, logout, user } = useStore();
    const navigate = useNavigate();
    const location = useLocation();

    // Query for shared counts
    const { data: sharedData } = useQuery({
        queryKey: ['shared-with-me-count'],
        queryFn: () => fetchSharedWithMe({}),
        staleTime: 60000,
    });

    const sharedCount = (sharedData?.activeCount || 0) + (sharedData?.pendingCount || 0);

    // Recursive category Tree Item
    const CategoryItem = ({ category, depth }: { category: Category; depth: number }) => {
        const [isExpanded, setIsExpanded] = useState(category.is_expanded);
        const hasChildren = category.children && category.children.length > 0;

        return (
            <div>
                <div
                    className="flex items-center gap-2 py-1.5 px-2 hover:bg-bg-hover rounded-md text-sm text-text-secondary hover:text-text-primary cursor-pointer transition-colors group"
                    style={{ paddingLeft: `${depth * 12 + 8}px` }}
                >
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                        className={`p-0.5 rounded hover:bg-bg-active ${!hasChildren && 'invisible'}`}
                    >
                        {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </button>

                    <span className="text-base">{category.icon || <Folder className="w-4 h-4" />}</span>
                    <span className="truncate flex-1">{category.name}</span>
                    <span className="text-xs text-text-muted opacity-0 group-hover:opacity-100">{category.prompt_count}</span>
                </div>
                {isExpanded && category.children && (
                    <div>
                        {category.children.map(child => (
                            <CategoryItem key={child.id} category={child} depth={depth + 1} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

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
                        className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm ${location.pathname === '/' && currentView === 'cards' ? 'bg-primary-500/10 text-primary-500' : 'text-text-secondary hover:bg-bg-hover'}`}
                    >
                        <LayoutGrid className="w-4 h-4" /> Cards
                    </button>
                    <button
                        onClick={() => handleViewChange('table')}
                        className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm ${location.pathname === '/' && currentView === 'table' ? 'bg-primary-500/10 text-primary-500' : 'text-text-secondary hover:bg-bg-hover'}`}
                    >
                        <LayoutList className="w-4 h-4" /> Tabela
                    </button>
                    <button
                        onClick={() => handleViewChange('kanban')}
                        className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm ${location.pathname === '/' && currentView === 'kanban' ? 'bg-primary-500/10 text-primary-500' : 'text-text-secondary hover:bg-bg-hover'}`}
                    >
                        <Kanban className="w-4 h-4" /> Kanban
                    </button>
                    <button
                        onClick={() => handleViewChange('folders')}
                        className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm ${location.pathname === '/' && currentView === 'folders' ? 'bg-primary-500/10 text-primary-500' : 'text-text-secondary hover:bg-bg-hover'}`}
                    >
                        <FolderTree className="w-4 h-4" /> Pastas
                    </button>
                </div>
            </div>

            {/* Shared Navigation */}
            <div className="p-3 border-b border-border-subtle">
                <button
                    onClick={() => navigate('/shared-with-me')}
                    className={`w-full flex items-center justify-between px-2 py-2 rounded-md text-sm ${location.pathname === '/shared-with-me' ? 'bg-primary-500/10 text-primary-500' : 'text-text-secondary hover:bg-bg-hover'}`}
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
                <div className="space-y-0.5">
                    {categoryTree.map(category => (
                        <CategoryItem key={category.id} category={category} depth={0} />
                    ))}
                </div>
            </div>

            {/* User Footer */}
            <div className="p-4 border-t border-border-subtle">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-accent-500 flex items-center justify-center text-white font-bold">
                        {user?.name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{user?.name}</p>
                        <p className="text-xs text-text-muted truncate">{user?.plan_id.toUpperCase()}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md border border-border-default text-xs font-medium text-text-secondary hover:bg-bg-hover transition-colors">
                        <Settings className="w-3 h-3" /> Config
                    </button>
                    <button onClick={logout} className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md border border-border-default text-xs font-medium text-text-secondary hover:bg-error-500/10 hover:text-error-500 transition-colors">
                        <LogOut className="w-3 h-3" /> Sair
                    </button>
                </div>
            </div>
        </aside>
    );
};
