import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    onClick,
    hoverable = false,
}) => {
    return (
        <div
            onClick={onClick}
            className={`
        bg-[var(--color-bg-elevated)]
        border border-[var(--color-border)]
        rounded-xl
        transition-all duration-200
        ${hoverable ? 'cursor-pointer hover:border-[var(--color-border-strong)] hover:shadow-lg hover:-translate-y-0.5' : ''}
        ${className}
      `}
        >
            {children}
        </div>
    );
};

// Card subcomponents for consistent structure
export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = '',
}) => (
    <div className={`px-4 py-3 border-b border-[var(--color-border)] ${className}`}>
        {children}
    </div>
);

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = '',
}) => (
    <div className={`px-4 py-4 ${className}`}>
        {children}
    </div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = '',
}) => (
    <div className={`px-4 py-3 border-t border-[var(--color-border)] ${className}`}>
        {children}
    </div>
);
