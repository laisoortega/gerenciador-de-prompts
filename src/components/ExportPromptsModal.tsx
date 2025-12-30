import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Download, FileJson, FileSpreadsheet, FileText, Lock, Check, Loader2 } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { usePlanLimits } from '../hooks/usePlanLimits';
import { UpgradePlanModal } from './UpgradePlanModal';

interface ExportPromptsModalProps {
    onClose: () => void;
}

type ExportFormat = 'json' | 'csv' | 'markdown';

export const ExportPromptsModal: React.FC<ExportPromptsModalProps> = ({ onClose }) => {
    const { prompts, categories } = useStore();
    const { limits } = usePlanLimits();

    const [format, setFormat] = useState<ExportFormat>('json');
    const [isExporting, setIsExporting] = useState(false);
    const [exportSuccess, setExportSuccess] = useState(false);
    const [showUpgrade, setShowUpgrade] = useState(false);

    const canExport = limits.canExport;

    const getCategoryName = (categoryId: string | null) => {
        if (!categoryId) return 'Sem categoria';
        return categories.find(c => c.id === categoryId)?.name || 'Sem categoria';
    };

    const handleExport = () => {
        if (!canExport) {
            setShowUpgrade(true);
            return;
        }

        setIsExporting(true);

        setTimeout(() => {
            let content = '';
            let filename = '';
            let mimeType = '';

            if (format === 'json') {
                const data = prompts.map(p => ({
                    title: p.title,
                    content: p.content,
                    tags: p.tags,
                    category: getCategoryName(p.category_id),
                    recommended_ai: p.recommended_ai,
                    created_at: p.created_at,
                }));
                content = JSON.stringify(data, null, 2);
                filename = 'blaze-prompts.json';
                mimeType = 'application/json';
            } else if (format === 'csv') {
                const headers = ['Título', 'Conteúdo', 'Tags', 'Categoria', 'IA Recomendada', 'Criado em'];
                const rows = prompts.map(p => [
                    `"${p.title.replace(/"/g, '""')}"`,
                    `"${p.content.replace(/"/g, '""')}"`,
                    `"${p.tags.join('; ')}"`,
                    `"${getCategoryName(p.category_id)}"`,
                    p.recommended_ai || 'gpt-4',
                    new Date(p.created_at).toLocaleDateString('pt-BR'),
                ]);
                content = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
                filename = 'blaze-prompts.csv';
                mimeType = 'text/csv';
            } else if (format === 'markdown') {
                const md = prompts.map(p => `# ${p.title}

**Categoria:** ${getCategoryName(p.category_id)}
**Tags:** ${p.tags.join(', ') || 'Nenhuma'}
**IA:** ${p.recommended_ai || 'GPT-4'}

---

${p.content}

---

`).join('\n\n');
                content = md;
                filename = 'blaze-prompts.md';
                mimeType = 'text/markdown';
            }

            // Create and download file
            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setIsExporting(false);
            setExportSuccess(true);
            setTimeout(() => onClose(), 1500);
        }, 500);
    };

    if (showUpgrade) {
        return <UpgradePlanModal onClose={() => setShowUpgrade(false)} limitType="export" />;
    }

    if (exportSuccess) {
        return (
            <Modal size="sm" onClose={onClose}>
                <div className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                        <Check className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">
                        Exportação Concluída!
                    </h3>
                    <p className="text-text-secondary">
                        {prompts.length} prompts foram exportados.
                    </p>
                </div>
            </Modal>
        );
    }

    return (
        <Modal size="md" onClose={onClose}>
            <Modal.Header>
                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <Download className="w-5 h-5 text-primary-500" />
                    Exportar Prompts
                </h2>
            </Modal.Header>

            <Modal.Body>
                {!canExport && (
                    <div className="mb-6 p-4 rounded-xl bg-warning-500/10 border border-warning-500/30">
                        <div className="flex items-center gap-2 text-warning-400 mb-2">
                            <Lock className="w-4 h-4" />
                            <span className="font-medium">Recurso Premium</span>
                        </div>
                        <p className="text-sm text-text-secondary">
                            A exportação de prompts está disponível apenas para planos pagos.
                        </p>
                    </div>
                )}

                <div className="mb-6">
                    <p className="text-sm text-text-secondary mb-1">Total de prompts:</p>
                    <p className="text-2xl font-bold text-text-primary">{prompts.length}</p>
                </div>

                <div className="mb-6">
                    <p className="text-sm text-text-secondary mb-3">Formato de exportação:</p>
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            onClick={() => setFormat('json')}
                            className={`p-4 rounded-xl border text-center transition-all ${format === 'json'
                                    ? 'border-primary-500 bg-primary-500/10'
                                    : 'border-border-default hover:border-primary-500/50'
                                }`}
                        >
                            <FileJson className={`w-8 h-8 mx-auto mb-2 ${format === 'json' ? 'text-primary-500' : 'text-text-muted'}`} />
                            <p className={`text-sm font-medium ${format === 'json' ? 'text-primary-500' : 'text-text-secondary'}`}>JSON</p>
                            <p className="text-xs text-text-muted">Para backup</p>
                        </button>
                        <button
                            onClick={() => setFormat('csv')}
                            className={`p-4 rounded-xl border text-center transition-all ${format === 'csv'
                                    ? 'border-primary-500 bg-primary-500/10'
                                    : 'border-border-default hover:border-primary-500/50'
                                }`}
                        >
                            <FileSpreadsheet className={`w-8 h-8 mx-auto mb-2 ${format === 'csv' ? 'text-primary-500' : 'text-text-muted'}`} />
                            <p className={`text-sm font-medium ${format === 'csv' ? 'text-primary-500' : 'text-text-secondary'}`}>CSV</p>
                            <p className="text-xs text-text-muted">Para Excel</p>
                        </button>
                        <button
                            onClick={() => setFormat('markdown')}
                            className={`p-4 rounded-xl border text-center transition-all ${format === 'markdown'
                                    ? 'border-primary-500 bg-primary-500/10'
                                    : 'border-border-default hover:border-primary-500/50'
                                }`}
                        >
                            <FileText className={`w-8 h-8 mx-auto mb-2 ${format === 'markdown' ? 'text-primary-500' : 'text-text-muted'}`} />
                            <p className={`text-sm font-medium ${format === 'markdown' ? 'text-primary-500' : 'text-text-secondary'}`}>Markdown</p>
                            <p className="text-xs text-text-muted">Para docs</p>
                        </button>
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                <Button
                    onClick={handleExport}
                    disabled={isExporting || prompts.length === 0}
                >
                    {isExporting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Exportando...
                        </>
                    ) : !canExport ? (
                        <>
                            <Lock className="w-4 h-4 mr-2" />
                            Fazer Upgrade
                        </>
                    ) : (
                        <>
                            <Download className="w-4 h-4 mr-2" />
                            Exportar {format.toUpperCase()}
                        </>
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
