import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { StoreProvider, useStore } from './contexts/StoreContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Onboarding } from './pages/Onboarding';
import { AppLayout } from './layouts/AppLayout';
import { AdminLayout } from './layouts/AdminLayout';
import SharedWithMePage from './pages/SharedWithMe';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { PlanManagement } from './pages/admin/PlanManagement';
import { Settings } from './pages/Settings';
import { Subscription } from './pages/Subscription';
import { Notifications } from './pages/Notifications';

const queryClient = new QueryClient();

const AppRoutes: React.FC = () => {
    const { user, isLoading } = useStore();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-bg-base flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (!user) {
        return <Login />;
    }

    if (!user.onboarding_completed) {
        return <Onboarding />;
    }

    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/shared-with-me" element={<SharedWithMePage />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/notifications" element={<Notifications />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={user.role === 'admin' ? <AdminLayout /> : <Navigate to="/" />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="plans" element={<PlanManagement />} />
                <Route path="settings" element={<div>Configurações (Em breve)</div>} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <StoreProvider>
                    <BrowserRouter>
                        <AppRoutes />
                    </BrowserRouter>
                </StoreProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
};

export default App;
