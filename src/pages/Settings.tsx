import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { useTheme } from '../contexts/ThemeContext';
import { User, Mail, Moon, Sun, Shield, LogOut, Variable, ChevronRight } from 'lucide-react';

export const Settings: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout, exportData, importData } = useStore();
    const { theme, setTheme } = useTheme();

    // Mock States for editable fields
    const [name, setName] = useState(user?.name || '');
    const [email] = useState(user?.email || '');

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-text-primary">Configurações</h2>

            {/* Profile Section */}
            <div className="bg-bg-surface border border-border-subtle rounded-xl p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary-500" />
                    Perfil
                </h3>

                <div className="flex items-start gap-6">
                    <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-2xl font-bold text-primary-600">
                        {user?.name?.charAt(0)}
                    </div>

                    <div className="flex-1 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Nome Completo</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-bg-elevated border border-border-default rounded-lg px-4 py-2 text-text-primary focus:ring-1 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
                            <div className="flex items-center gap-2 text-text-muted bg-bg-base/50 px-4 py-2 rounded-lg border border-border-subtle">
                                <Mail className="w-4 h-4" />
                                {email}
                                <span className="ml-auto text-xs bg-green-900/20 text-green-500 px-2 py-0.5 rounded-full">Verificado</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Variables Section */}
            <div className="bg-bg-surface border border-border-subtle rounded-xl p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center gap-2">
                    <Variable className="w-5 h-5 text-primary-500" />
                    Minhas Variáveis
                </h3>

                <button
                    onClick={() => navigate('/settings/variables')}
                    className="w-full flex items-center justify-between p-4 bg-bg-elevated rounded-lg border border-border-default hover:border-primary-500/50 transition-colors group"
                >
                    <div className="text-left">
                        <p className="font-medium text-text-primary">Gerenciar Variáveis Personalizadas</p>
                        <p className="text-sm text-text-secondary">Crie variáveis reutilizáveis para seus prompts (ex: marca, público, produto)</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-primary-500 transition-colors" />
                </button>
            </div>

            {/* Preferences Section */}
            <div className="bg-bg-surface border border-border-subtle rounded-xl p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary-500" />
                    Preferências
                </h3>

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-text-primary">Tema</p>
                            <p className="text-sm text-text-secondary">Escolha a aparência da interface</p>
                        </div>
                        <div className="flex bg-bg-elevated p-1 rounded-lg border border-border-default">
                            <button
                                onClick={() => setTheme('light')}
                                className={`p-2 rounded-md transition-all ${theme === 'light' ? 'bg-bg-surface shadow text-primary-500' : 'text-text-muted hover:text-text-primary'}`}
                            >
                                <Sun className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setTheme('dark')}
                                className={`p-2 rounded-md transition-all ${theme === 'dark' ? 'bg-bg-surface shadow text-primary-500' : 'text-text-muted hover:text-text-primary'}`}
                            >
                                <Moon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-text-primary">Notificações por Email</p>
                            <p className="text-sm text-text-secondary">Receba atualizações sobre seus prompts</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-border-default peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Data Management Section */}
            <div className="bg-bg-surface border border-border-subtle rounded-xl p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary-500" />
                    Backup e Dados
                </h3>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-bg-elevated rounded-lg border border-border-default">
                        <div>
                            <p className="font-medium text-text-primary">Exportar Dados</p>
                            <p className="text-sm text-text-secondary">Baixe uma cópia de todos os seus prompts e categorias (JSON).</p>
                        </div>
                        <button
                            onClick={exportData}
                            className="btn-secondary flex items-center gap-2"
                        >
                            Exportar
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-bg-elevated rounded-lg border border-border-default">
                        <div>
                            <p className="font-medium text-text-primary">Importar Dados</p>
                            <p className="text-sm text-text-secondary">Restaure seus dados a partir de um arquivo JSON.</p>
                        </div>
                        <label className="btn-secondary flex items-center gap-2 cursor-pointer">
                            Importar
                            <input
                                type="file"
                                accept=".json"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (ev) => {
                                            const content = ev.target?.result as string;
                                            importData(content);
                                        };
                                        reader.readAsText(file);
                                    }
                                }}
                            />
                        </label>
                    </div>
                </div>
            </div>

            {/* Account Actions */}
            <div className="bg-bg-surface border border-border-subtle rounded-xl p-6">
                <h3 className="text-lg font-semibold text-error-500 mb-6 flex items-center gap-2">
                    <LogOut className="w-5 h-5" />
                    Zona de Perigo
                </h3>

                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-medium text-text-primary">Sair da Conta</p>
                        <p className="text-sm text-text-secondary">Encerrar sua sessão atual</p>
                    </div>
                    <button
                        onClick={logout}
                        className="btn-secondary text-error-500 hover:bg-error-500/10 border-error-500/20"
                    >
                        Sair
                    </button>
                </div>
            </div>
        </div>
    );
};
