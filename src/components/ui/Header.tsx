import React, { useState } from 'react';
import { Search, Plus, Bell, Sparkles, Moon, Sun } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { useTheme } from '../../contexts/ThemeContext';
import { VideoAnalysisModal } from '../VideoAnalysisModal';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import { Input } from './Input';

export const Header: React.FC = () => {
    const { setTheme, theme } = useTheme();
    const { activeWorkspaceId, workspaces, searchQuery, setSearchQuery, setCreatePromptModalOpen } = useStore();
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

    const currentWorkspace = workspaces.find(w => w.id === activeWorkspaceId);

    return (
        <header className="h-16 bg-bg-surface border-b border-border-subtle flex items-center justify-between px-6">
            <div className="flex items-center gap-4 flex-1 mr-4">
                <h2 className="text-lg font-semibold text-text-primary mr-4 whitespace-nowrap">{currentWorkspace?.name}</h2>

                <div className="max-w-md w-full">
                    <Input
                        placeholder="Buscar prompts (Ctrl+K)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        icon={<Search className="w-4 h-4" />}
                        className="bg-bg-elevated border-none focus-visible:ring-1"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Button
                    variant="secondary"
                    onClick={() => setIsVideoModalOpen(true)}
                    className="gap-2"
                >
                    <Sparkles className="w-4 h-4 text-accent-500" />
                    <span className="hidden sm:inline">Analisar Vídeo</span>
                </Button>

                <div className="w-px h-6 bg-border-subtle mx-1"></div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                    {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </Button>

                <Link to="/notifications" className="relative p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error-500 rounded-full"></span>
                </Link>

                <Button
                    variant="primary"
                    onClick={() => setCreatePromptModalOpen(true)}
                    className="gap-2"
                >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Novo Prompt</span>
                </Button>
            </div>

            {isVideoModalOpen && (
                <VideoAnalysisModal onClose={() => setIsVideoModalOpen(false)} />
            )}
        </header>
    );
};

