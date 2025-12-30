import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular' | 'card';
    width?: string | number;
    height?: string | number;
    count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    className,
    variant = 'rectangular',
    width,
    height,
    count = 1,
}) => {
    const baseClasses = 'skeleton';

    const variantClasses = {
        text: 'h-4 rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg',
        card: 'rounded-2xl',
    };

    const style: React.CSSProperties = {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
    };

    const items = Array.from({ length: count }, (_, i) => (
        <div
            key={i}
            className={clsx(baseClasses, variantClasses[variant], className)}
            style={style}
        />
    ));

    return count === 1 ? items[0] : <>{items}</>;
};

// Card Skeleton
export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => {
    return (
        <>
            {Array.from({ length: count }, (_, i) => (
                <div key={i} className="bg-bg-surface border border-border-subtle rounded-2xl p-4 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <Skeleton width={80} height={24} className="rounded-md" />
                        <Skeleton variant="circular" width={24} height={24} />
                    </div>

                    {/* Title */}
                    <Skeleton height={20} className="w-3/4" />

                    {/* Description */}
                    <div className="space-y-2">
                        <Skeleton height={14} className="w-full" />
                        <Skeleton height={14} className="w-2/3" />
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2 pt-2">
                        <Skeleton width={60} height={20} className="rounded-full" />
                        <Skeleton width={48} height={20} className="rounded-full" />
                    </div>
                </div>
            ))}
        </>
    );
};

// Table Row Skeleton
export const TableRowSkeleton: React.FC<{ count?: number; columns?: number }> = ({
    count = 5,
    columns = 5
}) => {
    return (
        <>
            {Array.from({ length: count }, (_, i) => (
                <tr key={i} className="border-b border-border-subtle">
                    {Array.from({ length: columns }, (_, j) => (
                        <td key={j} className="p-4">
                            <Skeleton height={16} className={j === 0 ? 'w-3/4' : 'w-1/2'} />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
};

// List Item Skeleton
export const ListItemSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }, (_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-bg-surface rounded-xl">
                    <Skeleton variant="circular" width={40} height={40} />
                    <div className="flex-1 space-y-2">
                        <Skeleton height={16} className="w-1/2" />
                        <Skeleton height={12} className="w-1/3" />
                    </div>
                </div>
            ))}
        </div>
    );
};
