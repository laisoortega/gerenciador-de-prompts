import React from 'react';

interface BlazeLogoProps {
    size?: number;
    className?: string;
}

export function BlazeLogo({ size = 32, className = '' }: BlazeLogoProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="flameGradient" x1="16" y1="28" x2="16" y2="4" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="50%" stopColor="#fb923c" />
                    <stop offset="100%" stopColor="#fdba74" />
                </linearGradient>
            </defs>
            {/* Abstract flame shape - single continuous path */}
            <path
                d="M16 4C16 4 12 10 12 15C12 17 13 19 14 20C13 18 13.5 16 15 14.5C15 14.5 14 18 15 21C16 24 16 24 16 24C16 24 16 24 17 21C18 18 17 14.5 17 14.5C18.5 16 19 18 18 20C19 19 20 17 20 15C20 10 16 4 16 4Z"
                fill="url(#flameGradient)"
            />
            {/* Inner flame detail */}
            <path
                d="M16 8C16 8 14 12 14 15C14 16.5 14.5 17.5 15 18C14.5 17 15 15.5 16 14.5C17 15.5 17.5 17 17 18C17.5 17.5 18 16.5 18 15C18 12 16 8 16 8Z"
                fill="rgba(255,255,255,0.3)"
            />
        </svg>
    );
}

export function BlazeLogoText({ className = '' }: { className?: string }) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <BlazeLogo size={28} />
            <span className="font-bold text-lg text-text-primary tracking-tight">Blaze</span>
        </div>
    );
}
