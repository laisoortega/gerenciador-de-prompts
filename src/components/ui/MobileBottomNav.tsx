import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FileText, Settings, Plus, LogOut, Moon, Sun, X } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import clsx from 'clsx';

export const MobileBottomNav: React.FC = () => {
    const { user, setCreatePromptModalOpen } = useStore();
    const { signOut } = useAuth();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const [isMenuOpen, setMenuOpen] = useState(false);

    const bgColor = theme === 'dark' ? '#1d1d1d' : '#f6f6f6';

    return (
        <>
            {/* FAB */}
            <button
                onClick={() => setCreatePromptModalOpen(true)}
                className="lg:hidden fixed right-4 bottom-20 z-40 w-14 h-14 rounded-full bg-primary-500 text-white shadow-lg flex items-center justify-center active:scale-95"
                style={{ marginBottom: 'env(safe-area-inset-bottom, 0)' }}
            >
                <Plus className="w-6 h-6" />
            </button>

            {/* Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[60] lg:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
                    <div className="absolute bottom-0 left-0 right-0 rounded-t-2xl p-4 pb-6" style={{ backgroundColor: bgColor }}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <p className="font-medium text-text-primary">{user?.name || 'Usuário'}</p>
                                    <p className="text-xs text-text-muted">{user?.email || ''}</p>
                                </div>
                            </div>
                            <button onClick={() => setMenuOpen(false)} className="p-2 text-text-muted">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-1">
                            <button
                                onClick={() => { setTheme(theme === 'dark' ? 'light' : 'dark'); }}
                                className="w-full flex items-center gap-3 p-3 rounded-xl text-text-primary hover:bg-white/10"
                            >
                                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
                            </button>
                            <div className="border-t border-white/10 my-2" />
                            <button
                                onClick={() => { setMenuOpen(false); signOut(); }}
                                className="w-full flex items-center gap-3 p-3 rounded-xl text-error-400"
                            >
                                <LogOut className="w-5 h-5" />
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 lg:hidden z-50 border-t border-border-subtle" style={{ backgroundColor: bgColor }}>
                <div className="flex justify-around items-center max-w-md mx-auto pt-2 pb-4">
                    <NavLink
                        to="/"
                        className={({ isActive }) => clsx(
                            "flex flex-col items-center gap-0.5 p-2 rounded-xl",
                            isActive ? 'text-primary-500' : 'text-text-secondary'
                        )}
                    >
                        <FileText className="w-5 h-5" />
                        <span className="text-[10px] font-medium">Prompts</span>
                    </NavLink>

                    <NavLink
                        to="/settings"
                        className={({ isActive }) => clsx(
                            "flex flex-col items-center gap-0.5 p-2 rounded-xl",
                            isActive ? 'text-primary-500' : 'text-text-secondary'
                        )}
                    >
                        <Settings className="w-5 h-5" />
                        <span className="text-[10px] font-medium">Config</span>
                    </NavLink>

                    <button
                        onClick={() => setMenuOpen(true)}
                        className="flex flex-col items-center gap-0.5 p-2 rounded-xl text-text-secondary"
                    >
                        <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-white text-[10px] font-bold">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <span className="text-[10px] font-medium">Mais</span>
                    </button>
                </div>
            </nav>
        </>
    );
};
