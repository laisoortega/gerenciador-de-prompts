import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    children,
    disabled,
    ...props
}, ref) => {

    const variants = {
        primary: "bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-[#3b82f633]",
        secondary: "bg-bg-elevated hover:bg-bg-hover text-text-primary border border-border-default",
        ghost: "bg-transparent hover:bg-bg-hover text-text-secondary hover:text-text-primary",
        danger: "bg-error-500/10 text-error-500 hover:bg-error-500/20",
        outline: "bg-transparent border border-border-default hover:border-text-muted text-text-secondary hover:text-text-primary"
    };

    const sizes = {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 py-2",
        lg: "h-12 px-6 text-lg",
        icon: "h-9 w-9 p-0 flex items-center justify-center"
    };

    return (
        <button
            ref={ref}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            {children}
        </button>
    );
});

Button.displayName = "Button";
