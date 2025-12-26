import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/ui/Sidebar';
import { Header } from '../components/ui/Header';

export const AppLayout: React.FC = () => {
    return (
        <div className="flex h-screen bg-bg-base overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header />
                <main className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
