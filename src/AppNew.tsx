import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/DashboardNew';

// Import styles
import './styles/design-tokens.css';
import './styles/reset.css';
import './styles/utilities.css';

// Query Client with sensible defaults
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
        },
    },
});

// Loading component
const LoadingScreen: React.FC = () => (
    <div className="min-h-screen bg-[var(--color-bg-base)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-[var(--color-accent)] border-t-transparent" />
            <p className="text-[var(--color-text-muted)] text-sm">Carregando...</p>
        </div>
    </div>
);

// Protected Routes
const AppRoutes: React.FC = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!user) {
        return (
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        );
    }

    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/shared-with-me" element={<PlaceholderPage title="Compartilhados" />} />
            <Route path="/tags" element={<PlaceholderPage title="Tags" />} />
            <Route path="/variables" element={<PlaceholderPage title="Variáveis" />} />
            <Route path="/settings" element={<PlaceholderPage title="Configurações" />} />
            <Route path="/subscription" element={<PlaceholderPage title="Planos" />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

// Temporary placeholder for pages not yet implemented
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => {
    const { MainLayout } = require('./components/layout');

    return (
        <MainLayout>
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                        {title}
                    </h1>
                    <p className="text-[var(--color-text-muted)]">
                        Esta página será implementada em breve.
                    </p>
                </div>
            </div>
        </MainLayout>
    );
};

// Main App
const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default App;
