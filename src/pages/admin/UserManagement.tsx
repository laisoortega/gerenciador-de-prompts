import React, { useState, useEffect } from 'react';
import { MoreHorizontal, Search, Shield, Loader2, RefreshCw, Ban, CheckCircle, UserCog } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin' | 'super_admin';
    status: 'active' | 'inactive' | 'banned';
    plan_id: string | null;
    joined_at: string;
    last_sign_in_at: string | null;
    avatar_url: string | null;
}

export const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        if (!supabase) {
            // Mock data for development without Supabase
            setUsers([
                { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active', plan_id: null, joined_at: new Date().toISOString(), last_sign_in_at: null, avatar_url: null },
            ]);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);

            // Try to use the admin view first
            const { data, error } = await supabase
                .from('admin_users_view')
                .select('*')
                .order('joined_at', { ascending: false });

            if (error) {
                // Fallback: query user_profiles directly
                const { data: profiles, error: profileError } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (profileError) {
                    console.error('Error loading users:', profileError);
                    return;
                }

                setUsers((profiles || []).map(p => ({
                    id: p.id,
                    name: p.name || 'Usuário',
                    email: '', // No email in profiles table
                    role: p.role || 'user',
                    status: p.status || 'active',
                    plan_id: p.plan_id,
                    joined_at: p.created_at,
                    last_sign_in_at: null,
                    avatar_url: p.avatar_url
                })));
            } else {
                setUsers(data || []);
            }
        } catch (err) {
            console.error('Failed to load users:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const updateUserStatus = async (userId: string, newStatus: 'active' | 'inactive' | 'banned') => {
        if (!supabase) return;

        setActionLoading(userId);
        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({ status: newStatus, updated_at: new Date().toISOString() })
                .eq('id', userId);

            if (error) throw error;

            setUsers(prev => prev.map(u =>
                u.id === userId ? { ...u, status: newStatus } : u
            ));
        } catch (err) {
            console.error('Failed to update user status:', err);
        } finally {
            setActionLoading(null);
            setActiveMenu(null);
        }
    };

    const updateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
        if (!supabase) return;

        setActionLoading(userId);
        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({ role: newRole, updated_at: new Date().toISOString() })
                .eq('id', userId);

            if (error) throw error;

            setUsers(prev => prev.map(u =>
                u.id === userId ? { ...u, role: newRole } : u
            ));
        } catch (err) {
            console.error('Failed to update user role:', err);
        } finally {
            setActionLoading(null);
            setActiveMenu(null);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            active: 'bg-success-500/20 text-success-400',
            inactive: 'bg-gray-500/20 text-gray-400',
            banned: 'bg-error-500/20 text-error-400'
        };
        const labels: Record<string, string> = {
            active: 'Ativo',
            inactive: 'Inativo',
            banned: 'Banido'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.active}`}>
                {labels[status] || status}
            </span>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                    <p className="text-text-muted">Carregando usuários...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary">Gerenciar Usuários</h2>
                    <p className="text-text-muted text-sm mt-1">{users.length} usuários cadastrados</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={loadUsers}
                        className="p-2 text-text-muted hover:text-text-primary hover:bg-bg-elevated rounded-lg transition-colors"
                        title="Atualizar lista"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Buscar usuários..."
                            className="bg-bg-elevated border border-border-default text-text-primary pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:outline-none focus:border-primary-500 w-64"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-bg-surface border border-border-subtle rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-bg-elevated text-text-muted font-medium border-b border-border-subtle">
                        <tr>
                            <th className="px-6 py-4">Usuário</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Data de Entrada</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                                    {searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-bg-elevated/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold">
                                                {user.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-text-primary">{user.name || 'Sem nome'}</p>
                                                <p className="text-xs text-text-muted">{user.email || user.id.slice(0, 8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(user.status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">
                                            {(user.role === 'admin' || user.role === 'super_admin') && (
                                                <Shield className="w-3.5 h-3.5 text-primary-500" />
                                            )}
                                            <span className={user.role !== 'user' ? 'text-primary-400 font-medium' : 'text-text-secondary'}>
                                                {user.role === 'super_admin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : 'Usuário'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-text-secondary">
                                        {new Date(user.joined_at).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4 text-right relative">
                                        {actionLoading === user.id ? (
                                            <Loader2 className="w-5 h-5 animate-spin text-text-muted ml-auto" />
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                                                    className="text-text-muted hover:text-text-primary p-1.5 hover:bg-bg-elevated rounded-lg transition-colors"
                                                >
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </button>

                                                {activeMenu === user.id && (
                                                    <div className="absolute right-6 top-12 z-10 bg-bg-surface border border-border-default rounded-xl shadow-lg py-1 min-w-[160px]">
                                                        {user.status !== 'active' && (
                                                            <button
                                                                onClick={() => updateUserStatus(user.id, 'active')}
                                                                className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-bg-elevated flex items-center gap-2"
                                                            >
                                                                <CheckCircle className="w-4 h-4 text-success-500" />
                                                                Ativar
                                                            </button>
                                                        )}
                                                        {user.status !== 'banned' && (
                                                            <button
                                                                onClick={() => updateUserStatus(user.id, 'banned')}
                                                                className="w-full px-4 py-2 text-left text-sm text-error-400 hover:bg-bg-elevated flex items-center gap-2"
                                                            >
                                                                <Ban className="w-4 h-4" />
                                                                Banir
                                                            </button>
                                                        )}
                                                        <div className="border-t border-border-subtle my-1" />
                                                        {user.role === 'user' ? (
                                                            <button
                                                                onClick={() => updateUserRole(user.id, 'admin')}
                                                                className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-bg-elevated flex items-center gap-2"
                                                            >
                                                                <UserCog className="w-4 h-4" />
                                                                Tornar Admin
                                                            </button>
                                                        ) : user.role === 'admin' ? (
                                                            <button
                                                                onClick={() => updateUserRole(user.id, 'user')}
                                                                className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-bg-elevated flex items-center gap-2"
                                                            >
                                                                <UserCog className="w-4 h-4" />
                                                                Remover Admin
                                                            </button>
                                                        ) : null}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {!supabase && (
                <div className="bg-warning-500/10 border border-warning-500/30 rounded-xl p-4">
                    <p className="text-warning-500 text-sm">
                        <strong>Atenção:</strong> O Supabase não está configurado. Os dados exibidos são de demonstração.
                        Execute o SQL <code className="bg-bg-elevated px-1 rounded">supabase-users-schema.sql</code> para ativar.
                    </p>
                </div>
            )}
        </div>
    );
};
