import React from 'react';
import { PortalVortexIcon } from './CustomIcons';

interface AppLogoProps {
    size?: number;
    className?: string;
}

// Logo minimalista - apenas ícone
export function AppLogo({ size = 24, className = '' }: AppLogoProps) {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <PortalVortexIcon size={size} className="text-primary-500" />
        </div>
    );
}

// Alias para Sidebar colapsada
export const BlazeLogoIcon = AppLogo;

// Logo com texto - minimalista
export function AppLogoText({ className = '' }: { className?: string }) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <PortalVortexIcon size={20} className="text-primary-500" />
            <span className="font-semibold text-lg text-text-primary">
                A-Lá-Laís
            </span>
        </div>
    );
}

// Alias para compatibilidade
export const BlazeLogoText = AppLogoText;
