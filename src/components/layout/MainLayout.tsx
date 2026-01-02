import React, { useState } from 'react';
import { Sidebar, MobileHeader } from './Sidebar';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[var(--color-bg-base)]">
            {/* Mobile Header */}
            <MobileHeader onMenuClick={() => setSidebarOpen(true)} />

            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <main className="lg:ml-[var(--sidebar-width)] pt-[var(--header-height)] lg:pt-0 min-h-screen">
                <div className="p-4 lg:p-6 max-w-[var(--content-max-width)] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};
