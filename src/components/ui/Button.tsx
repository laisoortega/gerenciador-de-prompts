import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: React.ReactNode;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    children,
    disabled,
    className = '',
    ...props
}) => {
    const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-lg transition-all
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg-base)]
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

    const variants = {
        primary: `
      bg-[var(--color-accent)] text-white
      hover:bg-[var(--color-accent-hover)]
      focus:ring-[var(--color-accent)]
    `,
        secondary: `
      bg-[var(--color-bg-surface)] text-[var(--color-text-primary)]
      border border-[var(--color-border)]
      hover:bg-[var(--color-bg-hover)]
      focus:ring-[var(--color-border-strong)]
    `,
        ghost: `
      text-[var(--color-text-secondary)]
      hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]
      focus:ring-[var(--color-border)]
    `,
        danger: `
      bg-[var(--color-error)] text-white
      hover:opacity-90
      focus:ring-[var(--color-error)]
    `,
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                </svg>
            ) : icon}
            {children}
        </button>
    );
};
