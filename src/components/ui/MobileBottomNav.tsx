import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutGrid, Share2, Plus, Settings, LogOut, User, MoreHorizontal, X } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { useAuth } from '../../contexts/AuthContext';

export const MobileBottomNav: React.FC = () => {
    const { user, setMobileMenuOpen, isMobileMenuOpen, setCreatePromptModalOpen } = useStore();
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    return (
        <>
            {/* FAB - Floating Action Button for Create */}
            <button
                onClick={() => setCreatePromptModalOpen(true)}
                className="lg:hidden fixed right-4 bottom-20 z-40 w-14 h-14 rounded-full bg-primary-500 text-white shadow-lg shadow-primary-500/30 flex items-center justify-center transition-all active:scale-95 hover:bg-primary-400 hover:shadow-xl animate-fadeIn"
                style={{ marginBottom: 'env(safe-area-inset-bottom, 0)' }}
            >
                <Plus className="w-6 h-6" />
            </button>

            {/* Profile Menu Overlay */}
            {isProfileMenuOpen && (
                <div className="fixed inset-0 z-[60] lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
                        onClick={() => setIsProfileMenuOpen(false)}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-bg-surface rounded-t-2xl animate-slideUp p-4 pb-safe">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
                                    {user?.name?.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium text-text-primary">{user?.name}</p>
                                    <p className="text-xs text-text-muted">{user?.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsProfileMenuOpen(false)}
                                className="p-2 rounded-lg text-text-muted hover:bg-bg-hover"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Menu Items */}
                        <div className="space-y-1">
                            <button
                                onClick={() => {
                                    setIsProfileMenuOpen(false);
                                    navigate('/settings');
                                }}
                                className="w-full flex items-center gap-3 p-3 rounded-xl text-text-primary hover:bg-bg-hover transition-colors"
                            >
                                <Settings className="w-5 h-5 text-text-muted" />
                                Configurações
                            </button>
                            <button
                                onClick={() => {
                                    setIsProfileMenuOpen(false);
                                    navigate('/subscription');
                                }}
                                className="w-full flex items-center gap-3 p-3 rounded-xl text-text-primary hover:bg-bg-hover transition-colors"
                            >
                                <User className="w-5 h-5 text-text-muted" />
                                Minha Assinatura
                            </button>
                            <div className="border-t border-border-subtle my-2" />
                            <button
                                onClick={() => {
                                    setIsProfileMenuOpen(false);
                                    signOut();
                                }}
                                className="w-full flex items-center gap-3 p-3 rounded-xl text-error-400 hover:bg-error-500/10 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                Sair da Conta
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Navigation Bar */}
            <nav className="fixed bottom-0 left-0 right-0 bg-bg-surface border-t border-border-subtle lg:hidden z-50 animate-slideUp">
                <div className="flex justify-around items-center max-w-md mx-auto px-2 pt-2 pb-safe">
                    <NavLink
                        to="/"
                        className={({ isActive }) => `
                            flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all active:scale-95 touch-target
                            ${isActive ? 'text-primary-500' : 'text-text-secondary'}
                        `}
                    >
                        <LayoutGrid className="w-5 h-5" />
                        <span className="text-[10px] font-medium">Home</span>
                    </NavLink>

                    <NavLink
                        to="/shared-with-me"
                        className={({ isActive }) => `
                            flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all active:scale-95 touch-target
                            ${isActive ? 'text-primary-500' : 'text-text-secondary'}
                        `}
                    >
                        <Share2 className="w-5 h-5" />
                        <span className="text-[10px] font-medium">Shared</span>
                    </NavLink>

                    <button
                        onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                        className={`
                            flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all active:scale-95 touch-target
                            ${isMobileMenuOpen ? 'text-primary-500' : 'text-text-secondary'}
                        `}
                    >
                        <LayoutGrid className="w-5 h-5" />
                        <span className="text-[10px] font-medium">Menu</span>
                    </button>

                    {/* Profile Button with Menu */}
                    <button
                        onClick={() => setIsProfileMenuOpen(true)}
                        className="flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all active:scale-95 touch-target text-text-secondary"
                    >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-[10px] font-bold">
                            {user?.name?.charAt(0)}
                        </div>
                        <span className="text-[10px] font-medium">Perfil</span>
                    </button>
                </div>

                {/* Extra safe area padding */}
                <div className="h-safe bg-bg-surface" />
            </nav>
        </>
    );
};
