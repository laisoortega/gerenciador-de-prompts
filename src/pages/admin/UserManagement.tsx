import React, { useState } from 'react';
import { MoreHorizontal, Search, Shield } from 'lucide-react';

const MOCK_USERS = [
    { id: '1', name: 'Ana Silva', email: 'ana@example.com', role: 'admin', status: 'active', plan: 'pro', joined: '2023-12-01' },
    { id: '2', name: 'Carlos Souza', email: 'carlos@example.com', role: 'user', status: 'active', plan: 'free', joined: '2024-01-15' },
    { id: '3', name: 'Beatriz Costa', email: 'bia@example.com', role: 'user', status: 'inactive', plan: 'enterprise', joined: '2024-02-10' },
    { id: '4', name: 'João Oliveira', email: 'joao@example.com', role: 'user', status: 'banned', plan: 'free', joined: '2024-03-05' },
];

export const UserManagement: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter logic would go here

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Gerenciar Usuários</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar usuários..."
                        className="bg-gray-900 border border-gray-800 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-red-500 w-64"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-gray-950 text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">Usuário</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Plano</th>
                            <th className="px-6 py-4">Data de Entrada</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {MOCK_USERS.map(user => (
                            <tr key={user.id} className="hover:bg-gray-800/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{user.name}</p>
                                            <p className="text-xs">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-green-900/30 text-green-400' :
                                        user.status === 'inactive' ? 'bg-gray-800 text-gray-400' :
                                            'bg-red-900/30 text-red-400'
                                        }`}>
                                        {user.status === 'active' ? 'Ativo' : user.status === 'inactive' ? 'Inativo' : 'Banido'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1">
                                        {user.role === 'admin' && <Shield className="w-3 h-3 text-red-500" />}
                                        <span className={user.role === 'admin' ? 'text-red-400' : ''}>{user.role}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="uppercase text-xs font-bold tracking-wider">{user.plan}</span>
                                </td>
                                <td className="px-6 py-4">
                                    {new Date(user.joined).toLocaleDateString('pt-BR')}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-gray-400 hover:text-white p-1">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
