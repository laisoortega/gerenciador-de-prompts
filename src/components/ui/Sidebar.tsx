import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { useAuth } from '../../contexts/AuthContext';
import { usePlanLimits } from '../../hooks/usePlanLimits';
import { Plus, Settings, LogOut, Inbox, Crown } from 'lucide-react';
import { SimpleCategoryList } from '../sidebar/SimpleCategoryList';
import { Button } from './Button';
import { BlazeLogoText } from './BlazeLogo';
import clsx from 'clsx';

export const Sidebar: React.FC = () => {
    const { categoryTree, user, setCreateCategoryModalOpen, selectedCategoryId, setSelectedCategoryId } = useStore();
    const { signOut } = useAuth();
    const { usage, limits, usagePercentage } = usePlanLimits();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <aside className="w-64 sidebar-gradient border-r border-border-subtle h-screen flex flex-col">
            {/* Logo - minimalista */}
            <div
                className="h-14 flex items-center px-5 border-b border-border-subtle cursor-pointer"
                onClick={() => navigate('/')}
            >
                <BlazeLogoText />
            </div>

            {/* Categories - área principal */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                        Categorias
                    </h3>
                    <button
                        onClick={() => setCreateCategoryModalOpen(true)}
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-text-muted hover:text-primary-500 hover:bg-primary-500/10 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                {/* Todos */}
                <button
                    onClick={() => {
                        setSelectedCategoryId(null);
                        navigate('/prompts');
                    }}
                    className={clsx(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-2",
                        selectedCategoryId === null
                            ? "bg-primary-500/10 text-primary-500"
                            : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
                    )}
                >
                    <Inbox className="w-4 h-4" />
                    Todos os Prompts
                    <span className="ml-auto text-xs text-text-muted">
                        {usage.promptCount}
                    </span>
                </button>

                {/* Lista de Categorias */}
                <SimpleCategoryList categories={categoryTree} />
            </div>

            {/* Upgrade Banner - se plano free */}
            {user?.plan_id === 'free' && (
                <div className="mx-4 mb-4 p-4 rounded-2xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Crown className="w-4 h-4 text-accent-500" />
                        <span className="text-sm font-semibold text-text-primary">Upgrade</span>
                    </div>
                    <p className="text-xs text-text-muted mb-3">
                        Desbloqueie prompts ilimitados e recursos premium
                    </p>
                    <Button
                        variant="primary"
                        size="sm"
                        className="w-full btn-cinematic"
                        onClick={() => navigate('/subscription')}
                    >
                        Ver Planos
                    </Button>
                </div>
            )}

            {/* User Footer - simplificado */}
            <div className="p-4 border-t border-border-subtle">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/20">
                        {user?.name?.charAt(0)?.toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                            {user?.name}
                        </p>
                        <p className="text-xs text-text-muted truncate">
                            {user?.email}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1">
                        <button
                            onClick={() => navigate('/settings')}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-hover transition-all"
                        >
                            <Settings className="w-4 h-4" />
                        </button>
                        <button
                            onClick={signOut}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-error-500 hover:bg-error-500/10 transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
};
