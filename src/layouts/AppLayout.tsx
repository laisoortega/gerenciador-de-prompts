import React from 'react';
import { Outlet } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { Sidebar } from '../components/ui/Sidebar';
import { Header } from '../components/ui/Header';
import { MobileBottomNav } from '../components/ui/MobileBottomNav';
import { CreatePromptModal } from '../components/CreatePromptModal';
import { CreateCategoryModal } from '../components/CreateCategoryModal';

export const AppLayout: React.FC = () => {
    const {
        isCreatePromptModalOpen,
        setCreatePromptModalOpen,
        isCreateCategoryModalOpen,
        setCreateCategoryModalOpen
    } = useStore();

    return (
        <div className="flex h-screen bg-bg-base overflow-hidden">
            {/* Sidebar hidden on mobile */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            <div className="flex-1 flex flex-col min-w-0 mb-[60px] md:mb-0">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin">
                    <Outlet />
                </main>
            </div>

            {/* Bottom Nav visible only on mobile */}
            <MobileBottomNav />

            {/* Global Modals */}
            {isCreatePromptModalOpen && (
                <CreatePromptModal onClose={() => setCreatePromptModalOpen(false)} />
            )}

            {isCreateCategoryModalOpen && (
                <CreateCategoryModal onClose={() => setCreateCategoryModalOpen(false)} />
            )}
        </div>
    );
};
