import React, { useState } from 'react';
import { Search, Plus, Moon, Sun, X, Menu as MenuIcon, Braces, FolderOpen, Users, Settings, LogOut } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { useStore } from '../../contexts/StoreContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
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
    const { searchQuery, setSearchQuery, setCreatePromptModalOpen, setMobileMenuOpen, user } = useStore();
    const { signOut } = useAuth();
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const currentTab = navTabs.find(tab => tab.path === location.pathname)?.id || 'prompts';

    return (
        <>
            {/* Desktop Header - Cor de Destaque */}
            <header className="hidden lg:block bg-primary-500">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="h-14 flex items-center justify-between">

                        {/* Left: Logo + Nav */}
                        <div className="flex items-center gap-8">
                            <Link to="/" className="flex items-center">
                                <BlazeLogoText />
                            </Link>

                            {/* Navigation */}
                            <nav className="flex items-center gap-6">
                                {navTabs.map(tab => {
                                    const isActive = currentTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => navigate(tab.path)}
                                            className={clsx(
                                                "text-sm font-medium transition-colors",
                                                isActive
                                                    ? "text-white"
                                                    : "text-white/70 hover:text-white"
                                            )}
                                        >
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-4">
                            {/* Search Button */}
                            <button
                                onClick={() => {/* TODO: Open search modal */ }}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <Search className="w-4 h-4" />
                                <span className="hidden xl:inline">Buscar</span>
                            </button>

                            {/* Theme Toggle */}
                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                            >
                                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            </button>

                            {/* New Prompt */}
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setCreatePromptModalOpen(true)}
                                className="gap-1.5 bg-white text-primary-600 hover:bg-white/90 border-0"
                            >
                                <Plus className="w-4 h-4" />
                                Novo
                            </Button>

                            {/* User Avatar */}
                            <Menu as="div" className="relative">
                                <Menu.Button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-medium text-sm hover:bg-white/30 transition-colors">
                                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </Menu.Button>
                                <Transition
                                    as={React.Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute right-0 mt-2 w-48 rounded-lg bg-bg-surface border border-border-subtle shadow-lg z-50 py-1">
                                        <div className="px-3 py-2 border-b border-border-subtle">
                                            <p className="text-sm font-medium text-text-primary truncate">{user?.name}</p>
                                            <p className="text-xs text-text-muted truncate">{user?.email}</p>
                                        </div>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={() => navigate('/settings')}
                                                    className={clsx(
                                                        "w-full flex items-center gap-2 px-3 py-2 text-sm",
                                                        active ? "bg-bg-hover text-text-primary" : "text-text-secondary"
                                                    )}
                                                >
                                                    <Settings className="w-4 h-4" /> Configurações
                                                </button>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={signOut}
                                                    className={clsx(
                                                        "w-full flex items-center gap-2 px-3 py-2 text-sm",
                                                        active ? "bg-error-500/10 text-error-500" : "text-text-secondary"
                                                    )}
                                                >
                                                    <LogOut className="w-4 h-4" /> Sair
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </div>
                    </div>
                </div>
            </header >

            {/* Mobile/Tablet Header */}
            < header className="lg:hidden h-14 bg-bg-surface border-b border-border-subtle flex items-center justify-between px-3 relative z-30" >
                {/* Mobile Search Overlay */}
                {
                    isSearchExpanded ? (
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
                                <MenuIcon className="w-5 h-5" />
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
                    )
                }
            </header >

            {isVideoModalOpen && (
                <VideoAnalysisModal onClose={() => setIsVideoModalOpen(false)} />
            )}
        </>
    );
};
