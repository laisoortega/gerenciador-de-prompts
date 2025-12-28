import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, Share2, Plus } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';

export const MobileBottomNav: React.FC = () => {
    const { user, setMobileMenuOpen, isMobileMenuOpen, setCreatePromptModalOpen } = useStore();

    return (
        <>
            {/* FAB - Floating Action Button for Create */}
            <button
                onClick={() => setCreatePromptModalOpen(true)}
                className="md:hidden fixed right-4 bottom-20 z-40 w-14 h-14 rounded-full bg-primary-500 text-white shadow-lg shadow-primary-500/30 flex items-center justify-center transition-all active:scale-95 hover:bg-primary-400 hover:shadow-xl animate-fadeIn"
                style={{ marginBottom: 'env(safe-area-inset-bottom, 0)' }}
            >
                <Plus className="w-6 h-6" />
            </button>

            {/* Bottom Navigation Bar */}
            <nav className="fixed bottom-0 left-0 right-0 bg-bg-surface border-t border-border-subtle md:hidden z-50 animate-slideUp">
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

                    {/* User Avatar / Subscription Link */}
                    <NavLink
                        to="/subscription"
                        className={({ isActive }) => `
                            flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all active:scale-95 touch-target
                            ${isActive ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-bg-surface rounded-full' : ''}
                        `}
                    >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-[10px] font-bold">
                            {user?.name?.charAt(0)}
                        </div>
                        <span className="text-[10px] font-medium text-text-secondary">Conta</span>
                    </NavLink>
                </div>

                {/* Extra safe area padding */}
                <div className="h-safe bg-bg-surface" />
            </nav>
        </>
    );
};
