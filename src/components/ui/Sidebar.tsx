import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FileText, Users, Tag, Variable, Settings, LogOut, ChevronLeft, ChevronRight, Moon, Sun, Plus, Crown } from 'lucide-react';
import clsx from 'clsx';
import { useStore } from '../../contexts/StoreContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { BlazeLogoText, BlazeLogoIcon } from './AppLogo';

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const { signOut } = useAuth();
    const { setCreatePromptModalOpen, user } = useStore();

    const navItems = [
        { id: 'prompts', label: 'Meus Prompts', icon: FileText, path: '/prompts' },
        { id: 'shared', label: 'Compartilhados', icon: Users, path: '/shared-with-me' },
        { id: 'tags', label: 'Tags', icon: Tag, path: '/tags' },
        { id: 'variables', label: 'Variáveis', icon: Variable, path: '/settings/variables' },
    ];

    const currentPath = location.pathname;
    const bgColor = theme === 'dark' ? '#1d1d1d' : '#f6f6f6';
    const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
    const mutedColor = theme === 'dark' ? 'text-white/60' : 'text-gray-500';
    const hoverBg = theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/5';
    const activeBg = theme === 'dark' ? 'bg-white/10' : 'bg-black/10';
    const borderColor = theme === 'dark' ? 'border-white/10' : 'border-black/10';

    return (
        <aside
            className={clsx(
                "fixed left-0 top-0 h-screen flex flex-col transition-all duration-300 z-40",
                isCollapsed ? "w-16" : "w-56"
            )}
            style={{ backgroundColor: bgColor }}
        >
            {/* Header */}
            <div className={clsx(
                "h-14 flex items-center border-b",
                borderColor,
                isCollapsed ? 'justify-center px-2' : 'justify-between px-4'
            )}>
                {!isCollapsed ? (
                    <Link to="/" className="flex items-center">
                        <BlazeLogoText />
                    </Link>
                ) : (
                    <Link to="/" className="flex items-center">
                        <BlazeLogoIcon />
                    </Link>
                )}

                {!isCollapsed && (
                    <button onClick={onToggle} className={clsx("p-1.5 rounded-lg", mutedColor, hoverBg)}>
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Expand button when collapsed */}
            {isCollapsed && (
                <button onClick={onToggle} className={clsx("mx-auto mt-2 p-1.5 rounded-lg", mutedColor, hoverBg)}>
                    <ChevronRight className="w-4 h-4" />
                </button>
            )}

            {/* New Prompt Button */}
            <div className={clsx("p-3", isCollapsed && "px-2")}>
                <button
                    onClick={() => setCreatePromptModalOpen(true)}
                    className={clsx(
                        "w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium",
                        "bg-primary-500 text-white hover:bg-primary-600",
                        isCollapsed ? "px-2" : "px-4"
                    )}
                >
                    <Plus className="w-4 h-4" />
                    {!isCollapsed && <span>Novo Prompt</span>}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1">
                {navItems.map(item => {
                    const isActive = item.path === '/'
                        ? currentPath === '/'
                        : currentPath.startsWith(item.path);
                    return (
                        <button
                            key={item.id}
                            onClick={() => navigate(item.path)}
                            className={clsx(
                                "w-full flex items-center gap-3 py-2.5 rounded-lg transition-all",
                                isCollapsed ? "justify-center px-2" : "px-3",
                                isActive ? clsx(activeBg, textColor) : clsx(mutedColor, hoverBg)
                            )}
                            title={isCollapsed ? item.label : undefined}
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                        </button>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className={clsx("p-3 space-y-1 border-t", borderColor)}>
                {/* Plan Badge */}
                <button
                    onClick={() => navigate('/subscription')}
                    className={clsx(
                        "w-full flex items-center gap-3 py-2.5 rounded-lg",
                        isCollapsed ? "justify-center px-2" : "px-3",
                        "bg-gradient-to-r from-primary-500 to-orange-500 text-white hover:opacity-90 transition-opacity"
                    )}
                    title={isCollapsed ? 'Plano Free - Upgrade' : undefined}
                >
                    <Crown className="w-5 h-5" />
                    {!isCollapsed && (
                        <div className="flex-1 flex items-center justify-between">
                            <span className="text-sm font-medium">Plano Free</span>
                            <span className="text-xs opacity-80">Upgrade</span>
                        </div>
                    )}
                </button>

                {/* Theme Toggle */}
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className={clsx("w-full flex items-center gap-3 py-2.5 rounded-lg", isCollapsed ? "justify-center px-2" : "px-3", mutedColor, hoverBg)}
                    title={isCollapsed ? (theme === 'dark' ? 'Modo Claro' : 'Modo Escuro') : undefined}
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    {!isCollapsed && <span className="text-sm font-medium">{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>}
                </button>

                {/* Settings */}
                <button
                    onClick={() => navigate('/settings')}
                    className={clsx(
                        "w-full flex items-center gap-3 py-2.5 rounded-lg",
                        isCollapsed ? "justify-center px-2" : "px-3",
                        currentPath === '/settings' || currentPath.startsWith('/settings')
                            ? clsx(activeBg, textColor)
                            : clsx(mutedColor, hoverBg)
                    )}
                    title={isCollapsed ? 'Configurações' : undefined}
                >
                    <Settings className="w-5 h-5" />
                    {!isCollapsed && <span className="text-sm font-medium">Configurações</span>}
                </button>

                {/* Logout */}
                <button
                    onClick={() => signOut()}
                    className={clsx(
                        "w-full flex items-center gap-3 py-2.5 rounded-lg",
                        isCollapsed ? "justify-center px-2" : "px-3",
                        "text-error-400 hover:bg-error-500/10"
                    )}
                    title={isCollapsed ? 'Sair' : undefined}
                >
                    <LogOut className="w-5 h-5" />
                    {!isCollapsed && <span className="text-sm font-medium">Sair</span>}
                </button>
            </div>
        </aside>
    );
}
