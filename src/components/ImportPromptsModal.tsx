import React, { useState, useRef } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Upload, FileJson, FileSpreadsheet, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { usePlanLimits } from '../hooks/usePlanLimits';

interface ImportPromptsModalProps {
    onClose: () => void;
}

interface ParsedPrompt {
    title: string;
    content: string;
    tags?: string[];
    category_id?: string;
    recommended_ai?: string;
}

type ImportFormat = 'json' | 'csv' | 'text';

export const ImportPromptsModal: React.FC<ImportPromptsModalProps> = ({ onClose }) => {
    const { addPrompt, categories } = useStore();
    const { canImport, promptsRemaining, limits } = usePlanLimits();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [format, setFormat] = useState<ImportFormat>('json');
    const [parsedPrompts, setParsedPrompts] = useState<ParsedPrompt[]>([]);
    const [textInput, setTextInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const [importSuccess, setImportSuccess] = useState(false);

    const canImportCount = promptsRemaining === Infinity ? parsedPrompts.length : Math.min(parsedPrompts.length, promptsRemaining);
    const willExceedLimit = parsedPrompts.length > promptsRemaining && promptsRemaining !== Infinity;

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);
        const text = await file.text();

        try {
            if (format === 'json') {
                const data = JSON.parse(text);
                const prompts = Array.isArray(data) ? data : data.prompts || [data];
                const validated = prompts.map((p: any) => ({
                    title: p.title || 'Sem título',
                    content: p.content || '',
                    tags: Array.isArray(p.tags) ? p.tags : [],
                    category_id: p.category_id,
                    recommended_ai: p.recommended_ai || 'gpt-4',
                }));
                setParsedPrompts(validated);
            } else if (format === 'csv') {
                const lines = text.split('\n').filter(l => l.trim());
                const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
                const prompts = lines.slice(1).map(line => {
                    const values = line.split(',');
                    const obj: any = {};
                    headers.forEach((h, i) => {
                        obj[h] = values[i]?.trim() || '';
                    });
                    return {
                        title: obj.title || obj.titulo || 'Sem título',
                        content: obj.content || obj.conteudo || '',
                        tags: (obj.tags || '').split(';').filter(Boolean),
                        recommended_ai: obj.ai || obj.recommended_ai || 'gpt-4',
                    };
                });
                setParsedPrompts(prompts);
            }
        } catch (err) {
            setError('Erro ao processar arquivo. Verifique o formato.');
            setParsedPrompts([]);
        }
    };

    const handleTextParse = () => {
        setError(null);
        if (!textInput.trim()) {
            setError('Cole algum conteúdo para importar');
            return;
        }

        // Simple parser: each paragraph is a prompt
        const paragraphs = textInput.split(/\n\n+/).filter(p => p.trim());
        const prompts = paragraphs.map((p, idx) => {
            const lines = p.split('\n');
            const title = lines[0]?.slice(0, 50) || `Prompt ${idx + 1}`;
            const content = p;
            return { title, content, tags: [], recommended_ai: 'gpt-4' };
        });

        setParsedPrompts(prompts);
    };

    const handleImport = async () => {
        if (parsedPrompts.length === 0) return;

        setIsImporting(true);
        setError(null);

        try {
            const toImport = parsedPrompts.slice(0, canImportCount);

            for (const prompt of toImport) {
                await addPrompt({
                    title: prompt.title,
                    content: prompt.content,
                    tags: prompt.tags || [],
                    category_id: prompt.category_id || null,
                    recommended_ai: prompt.recommended_ai || 'gpt-4',
                    is_favorite: false,
                    workspace_id: null,
                });
            }

            setImportSuccess(true);
            setTimeout(() => onClose(), 1500);
        } catch (err) {
            setError('Erro ao importar prompts');
        } finally {
            setIsImporting(false);
        }
    };

    if (importSuccess) {
        return (
            <Modal size="sm" onClose={onClose}>
                <div className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                        <Check className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">
                        Importação Concluída!
                    </h3>
                    <p className="text-text-secondary">
                        {canImportCount} prompts foram importados com sucesso.
                    </p>
                </div>
            </Modal>
        );
    }

    return (
        <Modal size="lg" onClose={onClose}>
            <Modal.Header>
                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <Upload className="w-5 h-5 text-primary-500" />
                    Importar Prompts
                </h2>
            </Modal.Header>

            <Modal.Body>
                {/* Format Selection */}
                <div className="mb-6">
                    <p className="text-sm text-text-secondary mb-3">Formato do arquivo:</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => { setFormat('json'); setParsedPrompts([]); }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${format === 'json'
                                    ? 'border-primary-500 bg-primary-500/10 text-primary-500'
                                    : 'border-border-default text-text-secondary hover:border-primary-500/50'
                                }`}
                        >
                            <FileJson className="w-4 h-4" /> JSON
                        </button>
                        <button
                            onClick={() => { setFormat('csv'); setParsedPrompts([]); }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${format === 'csv'
                                    ? 'border-primary-500 bg-primary-500/10 text-primary-500'
                                    : 'border-border-default text-text-secondary hover:border-primary-500/50'
                                }`}
                        >
                            <FileSpreadsheet className="w-4 h-4" /> CSV
                        </button>
                        <button
                            onClick={() => { setFormat('text'); setParsedPrompts([]); }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${format === 'text'
                                    ? 'border-primary-500 bg-primary-500/10 text-primary-500'
                                    : 'border-border-default text-text-secondary hover:border-primary-500/50'
                                }`}
                        >
                            Texto
                        </button>
                    </div>
                </div>

                {/* File Upload or Text Input */}
                {format === 'text' ? (
                    <div className="mb-6">
                        <textarea
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder="Cole seus prompts aqui. Separe cada prompt com uma linha em branco."
                            className="w-full h-40 p-3 rounded-xl border border-border-default bg-bg-surface text-text-primary placeholder-text-muted resize-none focus:outline-none focus:border-primary-500 focus:outline-none"
                        />
                        <Button onClick={handleTextParse} className="mt-2">
                            Processar Texto
                        </Button>
                    </div>
                ) : (
                    <div className="mb-6">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={format === 'json' ? '.json' : '.csv'}
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full border-2 border-dashed border-border-default rounded-xl p-8 text-center hover:border-primary-500/50 transition-colors"
                        >
                            <Upload className="w-8 h-8 mx-auto mb-2 text-text-muted" />
                            <p className="text-text-secondary">
                                Clique para selecionar arquivo {format.toUpperCase()}
                            </p>
                        </button>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-error-500/10 border border-error-500/30 text-error-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Preview */}
                {parsedPrompts.length > 0 && (
                    <div className="mb-6">
                        <p className="text-sm font-medium text-text-primary mb-2">
                            {parsedPrompts.length} prompts encontrados
                        </p>

                        {willExceedLimit && (
                            <div className="mb-3 p-3 rounded-lg bg-warning-500/10 border border-warning-500/30 text-warning-400 text-sm flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>
                                    Você pode importar apenas {promptsRemaining} prompts (limite do plano).
                                    {parsedPrompts.length - promptsRemaining} serão ignorados.
                                </span>
                            </div>
                        )}

                        <div className="max-h-48 overflow-y-auto space-y-2">
                            {parsedPrompts.slice(0, 5).map((p, idx) => (
                                <div key={idx} className="p-2 rounded-lg bg-bg-elevated text-sm">
                                    <p className="font-medium text-text-primary truncate">{p.title}</p>
                                    <p className="text-text-muted truncate">{p.content.slice(0, 80)}...</p>
                                </div>
                            ))}
                            {parsedPrompts.length > 5 && (
                                <p className="text-sm text-text-muted text-center">
                                    +{parsedPrompts.length - 5} mais...
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                <Button
                    onClick={handleImport}
                    disabled={parsedPrompts.length === 0 || isImporting}
                >
                    {isImporting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Importando...
                        </>
                    ) : (
                        `Importar ${canImportCount} prompts`
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
