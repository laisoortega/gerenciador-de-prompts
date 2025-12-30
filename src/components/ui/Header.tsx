import React, { useState } from 'react';
import { Search, Plus, Bell, Sparkles, Moon, Sun, X, Menu, Inbox, Braces, FolderOpen, Users } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { useTheme } from '../../contexts/ThemeContext';
import { VideoAnalysisModal } from '../VideoAnalysisModal';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { Input } from './Input';
import { BlazeLogoText } from './BlazeLogo';
import clsx from 'clsx';

const navTabs = [
    { id: 'home', label: 'Dashboard', path: '/', icon: Inbox },
    { id: 'prompts', label: 'Meus Prompts', path: '/prompts', icon: FolderOpen },
    { id: 'shared', label: 'Compartilhados', path: '/shared-with-me', icon: Users },
    { id: 'variables', label: 'Variáveis', path: '/settings/variables', icon: Braces },
];

export const Header: React.FC = () => {
    const { setTheme, theme } = useTheme();
    const { searchQuery, setSearchQuery, setCreatePromptModalOpen, setMobileMenuOpen } = useStore();
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const currentTab = navTabs.find(tab => tab.path === location.pathname)?.id || 'prompts';

    return (
        <>
            {/* Desktop Header */}
            <header className="hidden lg:flex flex-col bg-bg-surface border-b border-border-subtle relative header-accent">
                {/* Top Row: Logo + Search + Actions */}
                <div className="h-14 flex items-center justify-between px-6">
                    {/* Logo */}
                    <div className="flex items-center gap-6">
                        <Link to="/" className="flex items-center">
                            <BlazeLogoText />
                        </Link>
                    </div>

                    {/* Search - Centralizado */}
                    <div className="flex-1 max-w-xl mx-8">
                        <Input
                            placeholder="Buscar prompts (Ctrl+K)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            icon={<Search className="w-4 h-4" />}
                            className="bg-bg-elevated border-none focus-visible:ring-1"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => setIsVideoModalOpen(true)}
                            className="gap-2"
                        >
                            <Sparkles className="w-4 h-4 text-accent-500" />
                            <span className="hidden xl:inline">Analisar Vídeo</span>
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
                            <span className="hidden xl:inline">Novo Prompt</span>
                        </Button>
                    </div>
                </div>

                {/* Bottom Row: Navigation Tabs */}
                <nav className="h-11 flex items-center px-6 gap-1">
                    {navTabs.map(tab => {
                        const Icon = tab.icon;
                        const isActive = currentTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => navigate(tab.path)}
                                className={clsx(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                    isActive
                                        ? "bg-primary-500/10 text-primary-500"
                                        : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
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

                        {/* Center: Logo */}
                        <Link to="/">
                            <BlazeLogoText />
                        </Link>

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
