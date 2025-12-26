import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/ui/AdminSidebar';

export const AdminLayout: React.FC = () => {
    return (
        <div className="flex h-screen bg-gray-950 text-white overflow-hidden font-sans">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900">
                    <h1 className="text-xl font-semibold">Painel Administrativo</h1>
                    <div className="flex items-center gap-4">
                        {/* Admin specific header actions if needed */}
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-800">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
