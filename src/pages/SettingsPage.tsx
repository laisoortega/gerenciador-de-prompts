import React, { useState } from 'react';
import { useStore } from '../contexts/StoreContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FolderOpen, Braces, Users, User, Trash2, Edit2, Plus, Moon, Sun, LogOut, Search } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

type TabId = 'categories' | 'variables' | 'shared' | 'account';

export const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabId>('categories');
    const { categories, prompts, addCategory, deleteCategory, updateCategory, userVariables } = useStore();
    const { user, signOut } = useAuth();
    const { theme, setTheme } = useTheme();

    // New category form
    const [newCategoryName, setNewCategoryName] = useState('');

    // Derive unique categories from prompts
    const uniqueCategoriesFromPrompts = [...new Set(
        prompts.map(p => p.category_id).filter(c => c && !c.includes('-'))
    )];

    const allCategories = [
        ...categories.map(c => ({ id: c.id, name: c.name, fromPrompts: false })),
        ...uniqueCategoriesFromPrompts
            .filter(c => !categories.find(cat => cat.name === c))
            .map(c => ({ id: c as string, name: c as string, fromPrompts: true }))
    ];

    const handleAddCategory = () => {
        if (newCategoryName.trim()) {
            addCategory({ name: newCategoryName.trim() });
            setNewCategoryName('');
        }
    };

    const tabs = [
        { id: 'categories' as TabId, label: 'Categorias', icon: FolderOpen },
        { id: 'variables' as TabId, label: 'Variáveis', icon: Braces },
        { id: 'shared' as TabId, label: 'Compartilhados', icon: Users },
        { id: 'account' as TabId, label: 'Conta', icon: User },
    ];

    return (
        <div className="animate-fadeIn">
            <h1 className="text-2xl font-bold text-text-primary mb-6">Configurações</h1>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-bg-elevated rounded-xl p-1 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={clsx(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                            activeTab === tab.id
                                ? "bg-primary-500 text-white"
                                : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
                        )}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-bg-surface rounded-xl border border-border-subtle p-6">
                {/* Categories Tab */}
                {activeTab === 'categories' && (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-text-primary">Gerenciar Categorias</h2>
                        </div>

                        {/* Add new category */}
                        <div className="flex gap-2 mb-6">
                            <Input
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Nome da nova categoria"
                                className="flex-1"
                            />
                            <Button onClick={handleAddCategory} disabled={!newCategoryName.trim()}>
                                <Plus className="w-4 h-4 mr-1" />
                                Adicionar
                            </Button>
                        </div>

                        {/* Categories list */}
                        <div className="space-y-2">
                            {allCategories.length === 0 ? (
                                <p className="text-text-muted text-center py-8">
                                    Nenhuma categoria. Crie uma acima ou digite ao criar um prompt.
                                </p>
                            ) : (
                                allCategories.map(cat => (
                                    <div key={cat.id} className="flex items-center justify-between p-3 bg-bg-elevated rounded-lg">
                                        <span className="font-medium text-text-primary">{cat.name}</span>
                                        <div className="flex items-center gap-2">
                                            {cat.fromPrompts && (
                                                <span className="text-xs text-text-muted bg-bg-surface px-2 py-0.5 rounded">
                                                    dos prompts
                                                </span>
                                            )}
                                            <button className="p-1.5 text-text-muted hover:text-primary-500 rounded-lg hover:bg-primary-500/10">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteCategory(cat.id)}
                                                className="p-1.5 text-text-muted hover:text-error-500 rounded-lg hover:bg-error-500/10"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Variables Tab */}
                {activeTab === 'variables' && (
                    <div>
                        <h2 className="text-lg font-semibold text-text-primary mb-4">Biblioteca de Variáveis</h2>
                        <p className="text-text-muted mb-4">
                            Variáveis são placeholders que você pode usar em seus prompts com a sintaxe {`{{nome}}`}.
                        </p>

                        {userVariables && userVariables.length > 0 ? (
                            <div className="space-y-2">
                                {userVariables.map((v: any) => (
                                    <div key={v.id} className="flex items-center justify-between p-3 bg-bg-elevated rounded-lg">
                                        <div>
                                            <code className="text-primary-500 bg-primary-500/10 px-2 py-0.5 rounded text-sm">
                                                {`{{${v.name}}}`}
                                            </code>
                                            {v.default_value && (
                                                <span className="text-text-muted text-sm ml-2">= {v.default_value}</span>
                                            )}
                                        </div>
                                        <button className="p-1.5 text-text-muted hover:text-error-500 rounded-lg hover:bg-error-500/10">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-text-muted text-center py-8">
                                As variáveis são detectadas automaticamente quando você usa {`{{variavel}}`} nos seus prompts.
                            </p>
                        )}
                    </div>
                )}

                {/* Shared Tab */}
                {activeTab === 'shared' && (
                    <div>
                        <h2 className="text-lg font-semibold text-text-primary mb-4">Prompts Compartilhados</h2>
                        <p className="text-text-muted text-center py-8">
                            Quando você compartilhar prompts com outros usuários ou receber prompts compartilhados, eles aparecerão aqui.
                        </p>
                    </div>
                )}

                {/* Account Tab */}
                {activeTab === 'account' && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-semibold text-text-primary mb-4">Minha Conta</h2>
                            <div className="flex items-center gap-4 p-4 bg-bg-elevated rounded-xl">
                                <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-white text-2xl font-bold">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <p className="font-semibold text-text-primary text-lg">{user?.name || 'Usuário'}</p>
                                    <p className="text-text-muted">{user?.email || ''}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-md font-semibold text-text-primary mb-3">Aparência</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setTheme('light')}
                                    className={clsx(
                                        "flex items-center gap-2 px-4 py-3 rounded-xl border transition-all",
                                        theme === 'light'
                                            ? "border-primary-500 bg-primary-500/10 text-primary-500"
                                            : "border-border-default text-text-secondary hover:border-primary-500/50"
                                    )}
                                >
                                    <Sun className="w-5 h-5" />
                                    Claro
                                </button>
                                <button
                                    onClick={() => setTheme('dark')}
                                    className={clsx(
                                        "flex items-center gap-2 px-4 py-3 rounded-xl border transition-all",
                                        theme === 'dark'
                                            ? "border-primary-500 bg-primary-500/10 text-primary-500"
                                            : "border-border-default text-text-secondary hover:border-primary-500/50"
                                    )}
                                >
                                    <Moon className="w-5 h-5" />
                                    Escuro
                                </button>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border-subtle">
                            <Button variant="ghost" onClick={() => signOut()} className="text-error-500 hover:bg-error-500/10">
                                <LogOut className="w-4 h-4 mr-2" />
                                Sair da Conta
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
