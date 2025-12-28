import { useState } from 'react';
import { Play, ExternalLink, Copy, Check, ChevronDown, MessageSquare, Code2 } from 'lucide-react';
import { Button } from './ui/Button';

// Plataformas de Chat (IAs)
const chatPlatforms = [
    { id: 'chatgpt', name: 'ChatGPT', baseUrl: 'https://chatgpt.com', buildUrl: (p: string) => `https://chatgpt.com/?q=${encodeURIComponent(p)}` },
    { id: 'claude', name: 'Claude', baseUrl: 'https://claude.ai', buildUrl: (p: string) => `https://claude.ai/new?q=${encodeURIComponent(p)}` },
    { id: 'gemini', name: 'Gemini', baseUrl: 'https://gemini.google.com', supportsQuerystring: false },
    { id: 'copilot', name: 'Microsoft Copilot', baseUrl: 'https://copilot.microsoft.com', supportsQuerystring: false },
    { id: 'perplexity', name: 'Perplexity', baseUrl: 'https://www.perplexity.ai', buildUrl: (p: string) => `https://www.perplexity.ai/search?q=${encodeURIComponent(p)}` },
    { id: 'deepseek', name: 'DeepSeek', baseUrl: 'https://chat.deepseek.com', supportsQuerystring: false },
    { id: 'grok', name: 'Grok', baseUrl: 'https://grok.com', buildUrl: (p: string) => `https://grok.com/chat?q=${encodeURIComponent(p)}` },
    { id: 'huggingchat', name: 'HuggingChat', baseUrl: 'https://huggingface.co/chat', buildUrl: (p: string) => `https://huggingface.co/chat/?prompt=${encodeURIComponent(p)}` },
    { id: 'mistral', name: 'Le Chat (Mistral)', baseUrl: 'https://chat.mistral.ai', buildUrl: (p: string) => `https://chat.mistral.ai/chat?q=${encodeURIComponent(p)}` },
    { id: 'poe', name: 'Poe', baseUrl: 'https://poe.com', supportsQuerystring: false },
];

// Plataformas de Código (IDEs/Ferramentas)
const codePlatforms = [
    { id: 'cursor', name: 'Cursor', baseUrl: 'cursor://anysphere.cursor-deeplink/prompt', buildUrl: (p: string) => `cursor://anysphere.cursor-deeplink/prompt?text=${encodeURIComponent(p)}`, isDeeplink: true },
    { id: 'bolt', name: 'Bolt.new', baseUrl: 'https://bolt.new', buildUrl: (p: string) => `https://bolt.new?prompt=${encodeURIComponent(p)}` },
    { id: 'lovable', name: 'Lovable', baseUrl: 'https://lovable.dev', buildUrl: (p: string) => `https://lovable.dev/?autosubmit=true#prompt=${encodeURIComponent(p)}` },
    { id: 'v0', name: 'v0.dev', baseUrl: 'https://v0.dev', buildUrl: (p: string) => `https://v0.dev/chat?q=${encodeURIComponent(p)}` },
    { id: 'github-copilot', name: 'GitHub Copilot', baseUrl: 'https://github.com/copilot', buildUrl: (p: string) => `https://github.com/copilot?prompt=${encodeURIComponent(p)}` },
];

interface Platform {
    id: string;
    name: string;
    baseUrl: string;
    buildUrl?: (prompt: string) => string;
    supportsQuerystring?: boolean;
    isDeeplink?: boolean;
}

interface RunPromptButtonProps {
    content: string;
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    showLabel?: boolean;
}

export function RunPromptButton({
    content,
    variant = 'primary',
    size = 'md',
    className = '',
    showLabel = true
}: RunPromptButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'chat' | 'code'>('chat');
    const [copied, setCopied] = useState(false);
    const [copiedForPlatform, setCopiedForPlatform] = useState<string | null>(null);

    const activePlatforms = activeTab === 'chat' ? chatPlatforms : codePlatforms;

    const handleRun = async (platform: Platform) => {
        // Se a plataforma não suporta querystring, copiar e abrir
        if (platform.supportsQuerystring === false) {
            try {
                await navigator.clipboard.writeText(content);
                setCopiedForPlatform(platform.name);
                setTimeout(() => {
                    window.open(platform.baseUrl, '_blank');
                    setCopiedForPlatform(null);
                }, 1500);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        } else if (platform.buildUrl) {
            // Abrir diretamente com o prompt na URL
            const url = platform.buildUrl(content);
            window.open(url, '_blank');
        } else {
            // Fallback: apenas abrir a URL base
            window.open(platform.baseUrl, '_blank');
        }
        setIsOpen(false);
    };

    const handleCopyAll = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="relative inline-block">
            <Button
                variant={variant}
                size={size}
                onClick={() => setIsOpen(!isOpen)}
                className={`gap-2 ${className}`}
            >
                <Play className="w-4 h-4" />
                {showLabel && 'Rodar em...'}
                <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-[9998]"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown - abre para CIMA */}
                    <div className="absolute right-0 bottom-full mb-2 w-72 bg-bg-surface border border-border-default rounded-xl shadow-2xl z-[9999] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                        {/* Tabs */}
                        <div className="flex border-b border-border-subtle">
                            <button
                                onClick={() => setActiveTab('chat')}
                                className={`flex-1 py-2.5 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'chat'
                                    ? 'text-primary-500 border-b-2 border-primary-500 bg-primary-500/5'
                                    : 'text-text-secondary hover:text-text-primary'
                                    }`}
                            >
                                <MessageSquare className="w-4 h-4" />
                                Chat
                            </button>
                            <button
                                onClick={() => setActiveTab('code')}
                                className={`flex-1 py-2.5 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'code'
                                    ? 'text-primary-500 border-b-2 border-primary-500 bg-primary-500/5'
                                    : 'text-text-secondary hover:text-text-primary'
                                    }`}
                            >
                                <Code2 className="w-4 h-4" />
                                Code
                            </button>
                        </div>

                        {/* Platform List */}
                        <div className="max-h-64 overflow-y-auto p-1">
                            {activePlatforms.map((platform) => (
                                <button
                                    key={platform.id}
                                    onClick={() => handleRun(platform)}
                                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-text-primary hover:bg-bg-elevated rounded-lg transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        {platform.supportsQuerystring === false ? (
                                            <Copy className="w-4 h-4 text-text-muted" />
                                        ) : (
                                            <ExternalLink className="w-4 h-4 text-success-500" />
                                        )}
                                        <span>{platform.name}</span>
                                    </div>
                                    {copiedForPlatform === platform.name && (
                                        <span className="text-xs text-success-500 flex items-center gap-1">
                                            <Check className="w-3 h-3" />
                                            Copiado!
                                        </span>
                                    )}
                                    {platform.supportsQuerystring === false && copiedForPlatform !== platform.name && (
                                        <span className="text-[10px] text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                                            copia + abre
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-border-subtle p-2">
                            <button
                                onClick={handleCopyAll}
                                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded-lg transition-colors"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4 text-success-500" />
                                        <span className="text-success-500">Prompt copiado!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        <span>Copiar prompt</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
