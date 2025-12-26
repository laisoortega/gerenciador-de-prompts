import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Play, Loader, FileText, Check, AlertCircle, Sparkles, Youtube, Instagram, Video } from 'lucide-react';
import { analyzeVideo, fetchAnalysisStatus, createPromptFromAnalysis } from '../services/api';
import { VideoAnalysis, GeneratedPrompt } from '../types';

interface VideoAnalyzerProps {
    onClose: () => void;
}

export function VideoAnalyzer({ onClose }: VideoAnalyzerProps) {
    const [url, setUrl] = useState('');
    const [analysisId, setAnalysisId] = useState<string | null>(null);
    const [polling, setPolling] = useState(false);

    // Mutation para iniciar análise
    const startAnalysisMutation = useMutation({
        mutationFn: (videoUrl: string) => analyzeVideo(videoUrl),
        onSuccess: (data) => {
            setAnalysisId(data.id);
            setPolling(true);
        },
    });

    // Query para verificar status (polling)
    const { data: analysis, error } = useQuery({
        queryKey: ['video-analysis', analysisId],
        queryFn: () => fetchAnalysisStatus(analysisId!),
        enabled: !!analysisId && polling,
        refetchInterval: (query) => {
            const status = query.state.data?.status;
            if (status === 'completed' || status === 'error') return false;
            return 2000; // Poll a cada 2s
        },
    });

    // Parar polling quando completar ou der erro
    useEffect(() => {
        if (analysis?.status === 'completed' || analysis?.status === 'error') {
            setPolling(false);
        }
    }, [analysis?.status]);

    // Mutation para criar prompt
    const createPromptMutation = useMutation({
        mutationFn: (generatedPrompt: GeneratedPrompt) => createPromptFromAnalysis(analysisId!, generatedPrompt),
        onSuccess: () => {
            // Sucesso
            onClose();
        },
    });

    const handleAnalyze = () => {
        if (!url.trim()) return;
        startAnalysisMutation.mutate(url);
    };

    const getPlatformIcon = (url: string) => {
        if (url.includes('youtube') || url.includes('youtu.be')) return <Youtube className="w-5 h-5 text-red-500" />;
        if (url.includes('instagram')) return <Instagram className="w-5 h-5 text-pink-500" />;
        return <Video className="w-5 h-5 text-primary-500" />;
    };

    return (
        <div className="space-y-6">
            {/* Input URL */}
            {!analysisId && (
                <div className="space-y-4">
                    <p className="text-text-secondary text-sm">
                        Cole o link de um vídeo do YouTube, Instagram ou TikTok para extrair o script e gerar templates de prompt.
                    </p>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                {getPlatformIcon(url)}
                            </div>
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="input-primary w-full pl-10"
                            />
                        </div>
                        <button
                            onClick={handleAnalyze}
                            disabled={!url.trim() || startAnalysisMutation.isPending}
                            className="btn-primary"
                        >
                            {startAnalysisMutation.isPending ? (
                                <Loader className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    Analisar
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Estado de Carregamento / Progresso */}
            {analysisId && analysis?.status !== 'completed' && analysis?.status !== 'error' && (
                <div className="text-center py-10">
                    <div className="relative inline-flex mb-4">
                        <div className="w-16 h-16 rounded-full border-4 border-bg-elevated"></div>
                        <div className="w-16 h-16 rounded-full border-4 border-primary-500 border-t-transparent animate-spin absolute inset-0"></div>
                        <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-primary-500 animate-pulse" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                        Analisando vídeo...
                    </h3>
                    <p className="text-text-secondary text-sm max-w-md mx-auto">
                        A IA está assistindo ao vídeo, transcrevendo o áudio e identificando a estrutura do roteiro.
                    </p>
                </div>
            )}

            {/* Erro */}
            {analysis?.status === 'error' && (
                <div className="bg-error-500/10 border border-error-500/20 rounded-lg p-4 text-center">
                    <AlertCircle className="w-8 h-8 text-error-500 mx-auto mb-2" />
                    <p className="text-error-500 font-medium">Falha na análise</p>
                    <p className="text-sm text-text-muted mt-1">
                        {analysis.error || 'Não foi possível processar este vídeo. Verifique se o link está correto e se o vídeo é público.'}
                    </p>
                    <button
                        onClick={() => { setAnalysisId(null); setUrl(''); }}
                        className="btn-ghost mt-3 text-sm"
                    >
                        Tentar novamente
                    </button>
                </div>
            )}

            {/* Resultados */}
            {analysis?.status === 'completed' && analysis.result && (
                <div className="space-y-6">
                    {/* Info do Vídeo */}
                    <div className="flex gap-4 p-4 bg-bg-elevated rounded-lg">
                        {analysis.video_info.thumbnail_url && (
                            <img
                                src={analysis.video_info.thumbnail_url}
                                alt="Thumbnail"
                                className="w-24 h-16 object-cover rounded"
                            />
                        )}
                        <div>
                            <h4 className="font-semibold text-text-primary line-clamp-1">
                                {analysis.video_info.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs px-2 py-0.5 bg-bg-surface rounded text-text-muted">
                                    {analysis.video_info.duration}s
                                </span>
                                <span className="text-xs text-text-muted">
                                    {analysis.video_info.author}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Transcrição (Expandable placeholder) */}
                    <div className="border border-border-subtle rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-text-secondary" />
                            <h4 className="font-medium text-text-primary text-sm">Resumo do Roteiro</h4>
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed">
                            {analysis.result.summary}
                        </p>
                    </div>

                    {/* Prompts Gerados */}
                    <div>
                        <h4 className="font-medium text-text-primary mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-accent-500" />
                            Prompts Sugeridos
                        </h4>
                        <div className="space-y-3">
                            {analysis.result.generated_prompts.map((prompt, index) => (
                                <div key={index} className="bg-bg-elevated border border-border-subtle rounded-lg p-4 hover:border-primary-500/30 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <h5 className="font-medium text-text-primary">{prompt.title}</h5>
                                        <span className="text-xs bg-bg-surface px-2 py-1 rounded text-text-muted">
                                            {prompt.category}
                                        </span>
                                    </div>
                                    <p className="text-sm text-text-secondary mb-3 line-clamp-3 font-mono bg-bg-surface p-2 rounded">
                                        {prompt.content}
                                    </p>
                                    <button
                                        onClick={() => createPromptMutation.mutate(prompt)}
                                        disabled={createPromptMutation.isPending}
                                        className="btn-primary w-full text-sm"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Salvar como Prompt
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
