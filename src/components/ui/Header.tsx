import React, { useState } from 'react';
import { Search, Plus, Bell, Sparkles, Moon, Sun, X, Menu } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { useTheme } from '../../contexts/ThemeContext';
import { VideoAnalysisModal } from '../VideoAnalysisModal';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import { Input } from './Input';

export const Header: React.FC = () => {
    const { setTheme, theme } = useTheme();
    const { activeWorkspaceId, workspaces, searchQuery, setSearchQuery, setCreatePromptModalOpen, setMobileMenuOpen } = useStore();
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);

    const currentWorkspace = workspaces.find(w => w.id === activeWorkspaceId);

    return (
        <>
            {/* Desktop Header */}
            <header className="hidden lg:flex h-16 bg-bg-surface border-b border-border-subtle items-center justify-between px-6 relative header-accent">
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
            </header>

            {/* Mobile/Tablet Header */}
            <header className="lg:hidden h-14 bg-bg-surface border-b border-border-subtle flex items-center justify-between px-3 relative z-30">
                {/* Mobile Search Overlay */}
                {isSearchExpanded ? (
                    <div className="absolute inset-0 bg-bg-surface flex items-center px-3 gap-2 z-40 animate-fadeIn">
                        <div className="flex-1">
                            <Input
                                placeholder="Buscar prompts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                icon={<Search className="w-4 h-4" />}
                                className="bg-bg-elevated border-none focus-visible:ring-1 h-10"
                                autoFocus
                            />
                        </div>
                        <button
                            onClick={() => {
                                setIsSearchExpanded(false);
                                setSearchQuery('');
                            }}
                            className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover touch-target flex items-center justify-center"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Left: Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover touch-target flex items-center justify-center"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        {/* Center: Title */}
                        <h2 className="text-base font-semibold text-text-primary truncate max-w-[140px]">
                            {currentWorkspace?.name || 'PromptMaster'}
                        </h2>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setIsSearchExpanded(true)}
                                className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover touch-target flex items-center justify-center"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setCreatePromptModalOpen(true)}
                                className="p-2 rounded-lg bg-primary-500 text-white hover:bg-primary-400 touch-target flex items-center justify-center"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </>
                )}
            </header>

            {isVideoModalOpen && (
                <VideoAnalysisModal onClose={() => setIsVideoModalOpen(false)} />
            )}
        </>
    );
};
