import React, { useState, useEffect } from 'react';
import { Settings, Bell, Shield, Globe, Palette, Save, ToggleLeft, ToggleRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useStore } from '../../contexts/StoreContext';

interface SettingToggleProps {
    label: string;
    description: string;
    enabled: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
}

const SettingToggle: React.FC<SettingToggleProps> = ({ label, description, enabled, onChange, disabled }) => (
    <div className="flex items-center justify-between py-4 border-b border-border-subtle last:border-0">
        <div>
            <h4 className="text-sm font-medium text-text-primary">{label}</h4>
            <p className="text-xs text-text-muted mt-0.5">{description}</p>
        </div>
        <button
            onClick={() => !disabled && onChange(!enabled)}
            disabled={disabled}
            className={`p-1 rounded-lg transition-colors ${enabled ? 'text-success-500' : 'text-text-muted'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {enabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
        </button>
    </div>
);

interface SettingSectionProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

const SettingSection: React.FC<SettingSectionProps> = ({ title, icon, children }) => (
    <div className="bg-bg-surface border border-border-subtle rounded-xl p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            {icon}
            {title}
        </h3>
        {children}
    </div>
);

// Types for system settings
interface GeneralSettings {
    maintenance_mode: boolean;
    new_registrations: boolean;
    email_verification: boolean;
}

interface NotificationSettings {
    email_notifications: boolean;
    new_user_notifications: boolean;
    payment_notifications: boolean;
}

interface PlanLimitSettings {
    free_prompt_limit: number;
    pro_prompt_limit: number;
    max_variables_per_prompt: number;
}

interface BrandingSettings {
    site_name: string;
    support_email: string;
}

interface SystemSettings {
    general: GeneralSettings;
    notifications: NotificationSettings;
    plan_limits: PlanLimitSettings;
    branding: BrandingSettings;
}

const defaultSettings: SystemSettings = {
    general: {
        maintenance_mode: false,
        new_registrations: true,
        email_verification: true
    },
    notifications: {
        email_notifications: true,
        new_user_notifications: true,
        payment_notifications: true
    },
    plan_limits: {
        free_prompt_limit: 50,
        pro_prompt_limit: 500,
        max_variables_per_prompt: 20
    },
    branding: {
        site_name: 'PromptMaster',
        support_email: 'suporte@promptmaster.com'
    }
};

export const AdminSettings: React.FC = () => {
    const { user } = useStore();
    const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [hasChanges, setHasChanges] = useState(false);

    // Load settings from Supabase
    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        if (!supabase) {
            console.warn('Supabase not configured, using default settings');
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('system_settings')
                .select('key, value');

            if (error) {
                console.error('Error loading settings:', error);
                // Use defaults if table doesn't exist yet
                return;
            }

            if (data && data.length > 0) {
                const loadedSettings: Partial<SystemSettings> = {};
                data.forEach((row: { key: string; value: any }) => {
                    if (row.key === 'general') loadedSettings.general = row.value as GeneralSettings;
                    if (row.key === 'notifications') loadedSettings.notifications = row.value as NotificationSettings;
                    if (row.key === 'plan_limits') loadedSettings.plan_limits = row.value as PlanLimitSettings;
                    if (row.key === 'branding') loadedSettings.branding = row.value as BrandingSettings;
                });
                setSettings({ ...defaultSettings, ...loadedSettings });
            }
        } catch (err) {
            console.error('Failed to load settings:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Save settings to Supabase
    const handleSave = async () => {
        if (!supabase) {
            alert('Supabase não configurado. Configure as variáveis de ambiente.');
            return;
        }

        setIsSaving(true);
        setSaveStatus('idle');

        try {
            // Update each setting section
            const updates = [
                { key: 'general', value: settings.general },
                { key: 'notifications', value: settings.notifications },
                { key: 'plan_limits', value: settings.plan_limits },
                { key: 'branding', value: settings.branding }
            ];

            for (const update of updates) {
                const { error } = await supabase
                    .from('system_settings')
                    .upsert({
                        key: update.key,
                        value: update.value,
                        updated_by: user?.id,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'key' });

                if (error) {
                    throw error;
                }
            }

            setSaveStatus('success');
            setHasChanges(false);
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch (err) {
            console.error('Failed to save settings:', err);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    // Update setting helpers
    const updateGeneral = (key: keyof GeneralSettings, value: boolean) => {
        setSettings(prev => ({
            ...prev,
            general: { ...prev.general, [key]: value }
        }));
        setHasChanges(true);
    };

    const updateNotifications = (key: keyof NotificationSettings, value: boolean) => {
        setSettings(prev => ({
            ...prev,
            notifications: { ...prev.notifications, [key]: value }
        }));
        setHasChanges(true);
    };

    const updatePlanLimits = (key: keyof PlanLimitSettings, value: number) => {
        setSettings(prev => ({
            ...prev,
            plan_limits: { ...prev.plan_limits, [key]: value }
        }));
        setHasChanges(true);
    };

    const updateBranding = (key: keyof BrandingSettings, value: string) => {
        setSettings(prev => ({
            ...prev,
            branding: { ...prev.branding, [key]: value }
        }));
        setHasChanges(true);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                    <p className="text-text-muted">Carregando configurações...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Configurações do Sistema</h1>
                    <p className="text-text-muted text-sm mt-1">Gerencie as configurações globais da plataforma</p>
                </div>
                <div className="flex items-center gap-3">
                    {saveStatus === 'success' && (
                        <span className="flex items-center gap-1.5 text-success-500 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            Salvo!
                        </span>
                    )}
                    {saveStatus === 'error' && (
                        <span className="flex items-center gap-1.5 text-error-500 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            Erro ao salvar
                        </span>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !hasChanges}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${hasChanges
                                ? 'bg-primary-600 hover:bg-primary-500 text-white'
                                : 'bg-bg-elevated text-text-muted cursor-not-allowed'
                            } ${isSaving ? 'opacity-70' : ''}`}
                    >
                        {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </div>

            {/* General Settings */}
            <SettingSection title="Configurações Gerais" icon={<Settings className="w-5 h-5 text-text-muted" />}>
                <SettingToggle
                    label="Modo de Manutenção"
                    description="Bloqueia acesso ao sistema para usuários comuns"
                    enabled={settings.general.maintenance_mode}
                    onChange={(v) => updateGeneral('maintenance_mode', v)}
                    disabled={isSaving}
                />
                <SettingToggle
                    label="Novos Registros"
                    description="Permite que novos usuários se cadastrem"
                    enabled={settings.general.new_registrations}
                    onChange={(v) => updateGeneral('new_registrations', v)}
                    disabled={isSaving}
                />
                <SettingToggle
                    label="Verificação de Email"
                    description="Exige verificação de email para novos cadastros"
                    enabled={settings.general.email_verification}
                    onChange={(v) => updateGeneral('email_verification', v)}
                    disabled={isSaving}
                />
            </SettingSection>

            {/* Notifications */}
            <SettingSection title="Notificações" icon={<Bell className="w-5 h-5 text-text-muted" />}>
                <SettingToggle
                    label="Notificações por Email"
                    description="Envia emails sobre atividades importantes"
                    enabled={settings.notifications.email_notifications}
                    onChange={(v) => updateNotifications('email_notifications', v)}
                    disabled={isSaving}
                />
                <SettingToggle
                    label="Novos Usuários"
                    description="Notifica quando um novo usuário se cadastra"
                    enabled={settings.notifications.new_user_notifications}
                    onChange={(v) => updateNotifications('new_user_notifications', v)}
                    disabled={isSaving}
                />
                <SettingToggle
                    label="Pagamentos"
                    description="Notifica sobre novos pagamentos e assinaturas"
                    enabled={settings.notifications.payment_notifications}
                    onChange={(v) => updateNotifications('payment_notifications', v)}
                    disabled={isSaving}
                />
            </SettingSection>

            {/* Plan Limits */}
            <SettingSection title="Limites de Planos" icon={<Shield className="w-5 h-5 text-text-muted" />}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">
                            Limite de Prompts (Plano Free)
                        </label>
                        <input
                            type="number"
                            value={settings.plan_limits.free_prompt_limit}
                            onChange={(e) => updatePlanLimits('free_prompt_limit', parseInt(e.target.value) || 0)}
                            disabled={isSaving}
                            className="w-full md:w-48 px-3 py-2.5 bg-bg-elevated border border-border-default rounded-xl text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">
                            Limite de Prompts (Plano Pro)
                        </label>
                        <input
                            type="number"
                            value={settings.plan_limits.pro_prompt_limit}
                            onChange={(e) => updatePlanLimits('pro_prompt_limit', parseInt(e.target.value) || 0)}
                            disabled={isSaving}
                            className="w-full md:w-48 px-3 py-2.5 bg-bg-elevated border border-border-default rounded-xl text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">
                            Máximo de Variáveis por Prompt
                        </label>
                        <input
                            type="number"
                            value={settings.plan_limits.max_variables_per_prompt}
                            onChange={(e) => updatePlanLimits('max_variables_per_prompt', parseInt(e.target.value) || 0)}
                            disabled={isSaving}
                            className="w-full md:w-48 px-3 py-2.5 bg-bg-elevated border border-border-default rounded-xl text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
                        />
                    </div>
                </div>
            </SettingSection>

            {/* Branding */}
            <SettingSection title="Branding" icon={<Palette className="w-5 h-5 text-text-muted" />}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">
                            Nome do Site
                        </label>
                        <input
                            type="text"
                            value={settings.branding.site_name}
                            onChange={(e) => updateBranding('site_name', e.target.value)}
                            disabled={isSaving}
                            className="w-full md:w-80 px-3 py-2.5 bg-bg-elevated border border-border-default rounded-xl text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">
                            Email de Suporte
                        </label>
                        <input
                            type="email"
                            value={settings.branding.support_email}
                            onChange={(e) => updateBranding('support_email', e.target.value)}
                            disabled={isSaving}
                            className="w-full md:w-80 px-3 py-2.5 bg-bg-elevated border border-border-default rounded-xl text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
                        />
                    </div>
                </div>
            </SettingSection>

            {/* Security Info */}
            <SettingSection title="Segurança" icon={<Globe className="w-5 h-5 text-text-muted" />}>
                <div className="bg-bg-elevated rounded-lg p-4 border border-border-subtle">
                    <p className="text-sm text-text-secondary">
                        <strong className="text-text-primary">Autenticação:</strong> Supabase Auth
                    </p>
                    <p className="text-sm text-text-secondary mt-2">
                        <strong className="text-text-primary">Banco de Dados:</strong> Supabase PostgreSQL
                    </p>
                    <p className="text-sm text-text-secondary mt-2">
                        <strong className="text-text-primary">RLS:</strong> Ativo em todas as tabelas
                    </p>
                    <p className="text-sm text-text-secondary mt-2">
                        <strong className="text-text-primary">Supabase Status:</strong>{' '}
                        <span className={supabase ? 'text-success-500' : 'text-warning-500'}>
                            {supabase ? 'Conectado' : 'Não configurado (modo mock)'}
                        </span>
                    </p>
                </div>
            </SettingSection>

            {/* Info about SQL */}
            {!supabase && (
                <div className="bg-warning-500/10 border border-warning-500/30 rounded-xl p-4">
                    <p className="text-warning-500 text-sm">
                        <strong>Atenção:</strong> O Supabase não está configurado. Para ativar o salvamento, configure as variáveis de ambiente
                        VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY, e execute o SQL em <code className="bg-bg-elevated px-1 rounded">supabase-system-settings.sql</code>.
                    </p>
                </div>
            )}
        </div>
    );
};
