import React from 'react';

interface TagProps {
    label: string;
    active?: boolean;
    removable?: boolean;
    onClick?: () => void;
    onRemove?: () => void;
    size?: 'sm' | 'md';
}

// Generate consistent color from string hash
function stringToHue(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % 360);
}

export const Tag: React.FC<TagProps> = ({
    label,
    active = false,
    removable = false,
    onClick,
    onRemove,
    size = 'md',
}) => {
    const hue = stringToHue(label);

    const baseStyles = `
    inline-flex items-center gap-1
    font-medium rounded-full
    transition-all cursor-pointer
    border
  `;

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
    };

    const activeStyles = active
        ? `bg-[hsl(${hue},70%,25%)] border-[hsl(${hue},70%,40%)] text-white`
        : `bg-[var(--color-bg-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]`;

    return (
        <span
            className={`${baseStyles} ${sizes[size]} ${activeStyles}`}
            onClick={onClick}
            style={{
                ...(active && {
                    backgroundColor: `hsl(${hue}, 70%, 20%)`,
                    borderColor: `hsl(${hue}, 70%, 40%)`,
                }),
            }}
        >
            {label}
            {removable && onRemove && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="ml-1 hover:text-[var(--color-error)] transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            )}
        </span>
    );
};

// Special "All" tag
export const AllTag: React.FC<{ active: boolean; onClick: () => void }> = ({
    active,
    onClick,
}) => (
    <span
        onClick={onClick}
        className={`
      inline-flex items-center px-3 py-1 text-sm font-medium rounded-full
      cursor-pointer transition-all border
      ${active
                ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-white'
                : 'bg-[var(--color-bg-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]'
            }
    `}
    >
        Todos
    </span>
);
