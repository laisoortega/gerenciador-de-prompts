import React from 'react';

interface IconProps {
    className?: string;
    size?: number;
}

export const PremiumSparkleIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <linearGradient id="sparkle-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--primary-400)" />
                <stop offset="100%" stopColor="var(--primary-600)" />
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <path
            d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
            fill="url(#sparkle-grad)"
            filter="url(#glow)"
        />
        <path
            d="M18 4L19 7L22 8L19 9L18 12L17 9L14 8L17 7L18 4Z"
            fill="var(--accent-400)"
            opacity="0.8"
        />
        <path
            d="M6 16L7 19L10 20L7 21L6 24L5 21L2 20L5 19L6 16Z"
            fill="var(--accent-500)"
            opacity="0.6"
        />
    </svg>
);

export const AICoreIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" className="opacity-30" />
        <circle cx="12" cy="12" r="6" stroke="var(--primary-500)" strokeWidth="2" filter="url(#glow)" />
        <circle cx="12" cy="12" r="2" fill="var(--primary-400)" />
        <path d="M12 2V5M12 19V22M2 12H5M19 12H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="opacity-50" />
    </svg>
);

export const MagicFolderIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M20 6H12L10 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6Z"
            fill="var(--bg-surface)"
            stroke="currentColor"
            strokeWidth="1.5"
        />
        <path
            d="M22 10C22 8.9 21.1 8 20 8H4C2.9 8 2 8.9 2 10V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V10Z"
            fill="rgba(255,255,255,0.03)"
            className="backdrop-blur-sm"
        />
        <path d="M12 14L13.5 11L15 14L12 14Z" fill="var(--primary-400)" className="animate-pulse" />
    </svg>
);

// Portal Icon - Design Minimalista Inspirado no Flow
// Traço fino (1.5px), movimento orbital, elemento de prompt no centro
export const PortalVortexIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* Círculo orbital externo */}
        <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.3"
        />

        {/* Arco orbital em movimento */}
        <path
            d="M12 3a9 9 0 0 1 9 9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
        />

        {/* Elemento central - Prompt/Chat minimalista */}
        <rect
            x="8"
            y="9"
            width="8"
            height="6"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
        />

        {/* Indicador de cursor/prompt */}
        <path
            d="M10.5 12h3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.8"
        />
    </svg>
);

