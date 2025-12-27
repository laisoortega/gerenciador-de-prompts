import React from 'react';
import { Outlet } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { Sidebar } from '../components/ui/Sidebar';
import { Header } from '../components/ui/Header';
import { MobileBottomNav } from '../components/ui/MobileBottomNav';
import { CreateCategoryModal } from '../components/CreateCategoryModal';

export const AppLayout: React.FC = () => {
    const {
        isCreateCategoryModalOpen,
        setCreateCategoryModalOpen,
        isMobileMenuOpen,
        setMobileMenuOpen
    } = useStore();

    return (
        <div className="flex h-screen bg-bg-base overflow-hidden relative">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    {/* Sidebar Content */}
                    <div className="absolute left-0 top-0 bottom-0 w-[80%] max-w-sm bg-bg-surface animate-slideRight">
                        <Sidebar />
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col min-w-0 mb-[60px] md:mb-0">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin">
                    <Outlet />
                </main>
            </div>

            {/* Bottom Nav visible only on mobile */}
            <MobileBottomNav />

            {/* Global Modal: Category only - Prompt modal is in Dashboard with edit data */}
            {isCreateCategoryModalOpen && (
                <CreateCategoryModal onClose={() => setCreateCategoryModalOpen(false)} />
            )}
        </div>
    );
};
