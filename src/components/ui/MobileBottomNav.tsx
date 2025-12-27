import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, Share2, Bell, Settings, User } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';

export const MobileBottomNav: React.FC = () => {
    const { user, setMobileMenuOpen, isMobileMenuOpen } = useStore();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-bg-surface border-t border-border-subtle pb-safe pt-2 px-6 md:hidden z-50 animate-slideUp">
            <div className="flex justify-between items-center max-w-sm mx-auto">
                <NavLink
                    to="/"
                    className={({ isActive }) => `
                        flex flex-col items-center gap-1 p-2 rounded-xl transition-all active:scale-95 min-w-[44px] min-h-[44px] justify-center
                        ${isActive ? 'text-primary-500' : 'text-text-secondary hover:text-text-primary'}
                    `}
                >
                    <LayoutGrid className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Home</span>
                </NavLink>

                <NavLink
                    to="/shared-with-me"
                    className={({ isActive }) => `
                        flex flex-col items-center gap-1 p-2 rounded-xl transition-all active:scale-95 min-w-[44px] min-h-[44px] justify-center
                        ${isActive ? 'text-primary-500' : 'text-text-secondary hover:text-text-primary'}
                    `}
                >
                    <Share2 className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Shared</span>
                </NavLink>

                <button
                    onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                    className={`
                        flex flex-col items-center gap-1 p-2 rounded-xl transition-all active:scale-95 min-w-[44px] min-h-[44px] justify-center
                        ${isMobileMenuOpen ? 'text-primary-500' : 'text-text-secondary hover:text-text-primary'}
                    `}
                >
                    <LayoutGrid className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Menu</span>
                </button>

                {/* Subscription Link via User Avatar */}
                <NavLink
                    to="/subscription"
                    className={({ isActive }) => `
                        flex flex-col items-center gap-1 p-2 rounded-xl transition-all active:scale-95 min-w-[44px] min-h-[44px] justify-center
                        ${isActive ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-bg-surface rounded-full' : ''}
                    `}
                >
                    <div className="w-7 h-7 rounded-full bg-accent-500 flex items-center justify-center text-white text-xs font-bold">
                        {user?.name?.charAt(0)}
                    </div>
                    <span className="text-[10px] font-medium text-text-secondary">Plan</span>
                </NavLink>
            </div>
            {/* Safe area padding bottom is handled by pb-safe if supported or just extra padding */}
            <div className="h-1 bg-transparent w-full" />
        </nav>
    );
};
