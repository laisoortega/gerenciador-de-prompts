import React, { useMemo } from 'react';
import clsx from 'clsx';

interface HighlightedPromptEditorProps {
    value: string;
    onChange?: (value: string) => void;
    readOnly?: boolean;
    placeholder?: string;
    className?: string;
    minHeight?: string;
}

/**
 * A simple textarea with CSS-based variable detection info
 * The highlighting is shown as a summary below the textarea
 */
export function HighlightedPromptEditor({
    value,
    onChange,
    readOnly = false,
    placeholder = 'Digite o conteúdo do prompt...',
    className = '',
    minHeight = '180px'
}: HighlightedPromptEditorProps) {
    // Detect variables in the content
    const detectedVariables = useMemo(() => {
        const regex = /\{\{([^}]+)\}\}/g;
        const matches = [...(value || '').matchAll(regex)].map(m => m[1].trim());
        return Array.from(new Set(matches));
    }, [value]);

    return (
        <div className={clsx("space-y-2", className)}>
            {/* Standard Textarea */}
            <textarea
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                readOnly={readOnly}
                placeholder={placeholder}
                className={clsx(
                    "w-full p-4 font-mono text-sm leading-relaxed rounded-xl resize-y",
                    "bg-bg-surface text-text-primary",
                    "border border-border-default focus:border-primary-500 focus:outline-none transition-colors",
                    readOnly ? "cursor-default" : "cursor-text"
                )}
                style={{ minHeight }}
            />

            {/* Variables Summary - Shows detected variables as chips */}
            {detectedVariables.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-primary-500/5 border border-primary-500/20">
                    <span className="text-xs font-medium text-text-secondary">
                        {detectedVariables.length} {detectedVariables.length === 1 ? 'variável' : 'variáveis'}:
                    </span>
                    {detectedVariables.map(varName => (
                        <span
                            key={varName}
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-primary-500/15 text-primary-500 border border-primary-500/30"
                        >
                            {`{{${varName}}}`}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

/**
 * Read-only version for displaying prompts with highlighted variables
 */
export function HighlightedPromptPreview({
    content,
    className = ''
}: {
    content: string;
    className?: string;
}) {
    // Parse content and replace variables with styled spans
    const parts = useMemo(() => {
        if (!content) return [];

        const result: { type: 'text' | 'variable'; value: string }[] = [];
        let lastIndex = 0;
        const regex = /\{\{([^}]+)\}\}/g;
        let match;

        while ((match = regex.exec(content)) !== null) {
            // Add text before the match
            if (match.index > lastIndex) {
                result.push({ type: 'text', value: content.slice(lastIndex, match.index) });
            }
            // Add the variable
            result.push({ type: 'variable', value: `{{${match[1]}}}` });
            lastIndex = match.index + match[0].length;
        }

        // Add remaining text
        if (lastIndex < content.length) {
            result.push({ type: 'text', value: content.slice(lastIndex) });
        }

        return result;
    }, [content]);

    return (
        <div className={clsx("font-mono text-sm leading-relaxed whitespace-pre-wrap", className)}>
            {parts.map((part, index) => (
                part.type === 'variable' ? (
                    <span
                        key={index}
                        className="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded bg-primary-500/15 text-primary-500 border border-primary-500/30 font-medium"
                    >
                        {part.value}
                    </span>
                ) : (
                    <span key={index} className="text-text-primary">{part.value}</span>
                )
            ))}
        </div>
    );
}
