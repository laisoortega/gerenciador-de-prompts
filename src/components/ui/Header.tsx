import React, { useState } from 'react';
import { Search, Plus, Bell, Sparkles } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { VideoAnalysisModal } from '../VideoAnalysisModal';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
    const { setTheme, theme } = useTheme();
    const { activeWorkspaceId, workspaces, searchQuery, setSearchQuery, setCreatePromptModalOpen } = useStore();
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

    const currentWorkspace = workspaces.find(w => w.id === activeWorkspaceId);

    return (
        <header className="h-16 bg-bg-surface border-b border-border-subtle flex items-center justify-between px-6">
            <div className="flex items-center gap-4 flex-1">
                <h2 className="text-lg font-semibold text-text-primary mr-8">{currentWorkspace?.name}</h2>

                <div className="relative max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Buscar prompts (Ctrl+K)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-bg-elevated border-none rounded-lg pl-10 pr-4 py-2 text-sm text-text-primary focus:ring-1 focus:ring-primary-500 placeholder-text-muted"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={() => setIsVideoModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-text-primary bg-bg-elevated hover:bg-bg-hover border border-border-default transition-colors"
                >
                    <Sparkles className="w-4 h-4 text-accent-500" />
                    <span className="hidden sm:inline">Analisar Vídeo</span>
                </button>

                <div className="w-px h-6 bg-border-subtle mx-1"></div>

                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-lg"
                >
                    {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>

                <Link to="/notifications" className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-lg relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-error-500 rounded-full"></span>
                </Link>

                <button
                    onClick={() => setCreatePromptModalOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Novo Prompt</span>
                </button>
            </div>

            {isVideoModalOpen && (
                <VideoAnalysisModal onClose={() => setIsVideoModalOpen(false)} />
            )}
        </header>
    );
};
