import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { LayoutDashboard, Users, CreditCard, Settings, ArrowLeft, LogOut } from 'lucide-react';

export const AdminSidebar: React.FC = () => {
    const { logout, user } = useStore();
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { path: '/admin/users', label: 'Usuários', icon: <Users className="w-5 h-5" /> },
        { path: '/admin/plans', label: 'Planos', icon: <CreditCard className="w-5 h-5" /> },
        { path: '/admin/settings', label: 'Configurações', icon: <Settings className="w-5 h-5" /> },
    ];

    return (
        <aside className="w-64 bg-gray-900 border-r border-gray-800 h-screen flex flex-col text-white">
            {/* Logo */}
            <div className="h-16 flex items-center px-4 border-b border-gray-800 cursor-pointer" onClick={() => navigate('/admin')}>
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">A</div>
                <span className="font-bold text-lg">Admin Panel</span>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
                <p className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Gerenciamento</p>
                {navItems.map(item => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${location.pathname === item.path
                                ? 'bg-red-600/20 text-red-500'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                    >
                        {item.icon}
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={() => navigate('/')}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-400 hover:bg-gray-800 hover:text-white mb-2"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Voltar ao App
                </button>

                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-800">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center font-bold">
                        {user?.name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">Admin</p>
                    </div>
                    <button onClick={logout} className="text-gray-500 hover:text-white">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
};
