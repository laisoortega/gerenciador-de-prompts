import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    icon,
    className = '',
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                        {icon}
                    </div>
                )}
                <input
                    className={`
            w-full px-4 py-2.5 
            bg-[var(--color-bg-surface)] 
            border border-[var(--color-border)]
            rounded-lg
            text-[var(--color-text-primary)]
            placeholder:text-[var(--color-text-muted)]
            focus:outline-none focus:border-[var(--color-accent)]
            transition-colors
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-[var(--color-error)]' : ''}
            ${className}
          `}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1.5 text-sm text-[var(--color-error)]">{error}</p>
            )}
        </div>
    );
};

// Textarea variant
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
    label,
    error,
    className = '',
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                    {label}
                </label>
            )}
            <textarea
                className={`
          w-full px-4 py-3 
          bg-[var(--color-bg-surface)] 
          border border-[var(--color-border)]
          rounded-lg
          text-[var(--color-text-primary)]
          placeholder:text-[var(--color-text-muted)]
          focus:outline-none focus:border-[var(--color-accent)]
          transition-colors
          resize-none
          ${error ? 'border-[var(--color-error)]' : ''}
          ${className}
        `}
                {...props}
            />
            {error && (
                <p className="mt-1.5 text-sm text-[var(--color-error)]">{error}</p>
            )}
        </div>
    );
};
