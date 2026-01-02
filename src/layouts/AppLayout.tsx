import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/ui/Sidebar';
import { MobileBottomNav } from '../components/ui/MobileBottomNav';
import clsx from 'clsx';

export const AppLayout: React.FC = () => {
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-bg-base overflow-hidden">
            {/* Sidebar - Desktop only */}
            <div className="hidden lg:block">
                <Sidebar
                    isCollapsed={isSidebarCollapsed}
                    onToggle={() => setSidebarCollapsed(!isSidebarCollapsed)}
                />
            </div>

            {/* Main Content - Offset by sidebar width */}
            <main
                className={clsx(
                    "flex-1 overflow-y-auto mb-[60px] lg:mb-0 transition-all duration-300",
                    isSidebarCollapsed ? "lg:ml-16" : "lg:ml-56"
                )}
            >
                <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6">
                    <Outlet />
                </div>
            </main>

            {/* Bottom Nav visible only on mobile */}
            <MobileBottomNav />
        </div>
    );
};
