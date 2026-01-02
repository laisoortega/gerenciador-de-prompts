import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Breadcrumbs: React.FC = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    if (location.pathname === '/') return null;

    const routeNames: Record<string, string> = {
        'prompts': 'Meus Prompts',
        'shared': 'Compartilhados',
        'settings': 'Configurações',
        'variables': 'Variáveis',
        'notifications': 'Notificações',
    };

    return (
        <nav className="flex items-center gap-2 text-sm text-text-muted mb-6 animate-fadeIn">
            <Link
                to="/"
                className="flex items-center gap-1.5 hover:text-primary-500 transition-colors"
            >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
            </Link>

            {pathnames.map((value, index) => {
                const last = index === pathnames.length - 1;
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                const name = routeNames[value] || value.charAt(0).toUpperCase() + value.slice(1);

                return (
                    <React.Fragment key={to}>
                        <ChevronRight className="w-3.5 h-3.5 text-text-disabled" />
                        {last ? (
                            <span className="font-semibold text-text-primary">{name}</span>
                        ) : (
                            <Link
                                to={to}
                                className="hover:text-primary-500 transition-colors"
                            >
                                {name}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};
