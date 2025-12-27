import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
    className,
    type,
    label,
    error,
    icon,
    ...props
}, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-text-secondary mb-1.5 ml-1">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    className={cn(
                        "flex h-10 w-full rounded-xl border border-border-default bg-bg-surface px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-disabled focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all text-text-primary",
                        icon && "pl-10",
                        error && "border-error-500 focus-visible:ring-error-500",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-xs text-error-500 mt-1 ml-1">{error}</p>
            )}
        </div>
    );
});

Input.displayName = "Input";
