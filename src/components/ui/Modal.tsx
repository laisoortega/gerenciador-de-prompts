import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen?: boolean;
    open?: boolean; // Alias for isOpen
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

interface ModalSubComponentProps {
    children: React.ReactNode;
    className?: string;
}

// Subcomponents
const ModalHeader: React.FC<ModalSubComponentProps> = ({ children, className = '' }) => (
    <div className={`flex items-center justify-between px-6 py-4 border-b border-border-subtle ${className}`}>
        {children}
    </div>
);

const ModalBody: React.FC<ModalSubComponentProps> = ({ children, className = '' }) => (
    <div className={`px-6 py-5 overflow-y-auto flex-1 ${className}`}>
        {children}
    </div>
);

const ModalFooter: React.FC<ModalSubComponentProps> = ({ children, className = '' }) => (
    <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t border-border-subtle ${className}`}>
        {children}
    </div>
);

// Main Modal Component
const ModalComponent: React.FC<ModalProps> = ({
    isOpen,
    open,
    onClose,
    title,
    children,
    footer,
    size = 'md',
}) => {
    const overlayRef = useRef<HTMLDivElement>(null);

    // Support both isOpen and open props
    const isVisible = isOpen ?? open ?? true;

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isVisible) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isVisible, onClose]);

    // Close on overlay click
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === overlayRef.current) {
            onClose();
        }
    };

    if (!isVisible) return null;

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
    };

    // Check if children includes subcomponents (Header, Body, Footer)
    const hasSubcomponents = React.Children.toArray(children).some(
        (child) => React.isValidElement(child) &&
            (child.type === ModalHeader || child.type === ModalBody || child.type === ModalFooter)
    );

    return createPortal(
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
        >
            <div
                className={`
                    w-full ${sizes[size]}
                    bg-bg-surface
                    border border-border-subtle
                    rounded-2xl shadow-2xl
                    animate-scaleIn
                    max-h-[90vh] overflow-hidden flex flex-col
                `}
            >
                {hasSubcomponents ? (
                    // Render with subcomponents (new pattern)
                    children
                ) : (
                    // Legacy pattern with title/children/footer props
                    <>
                        {/* Header */}
                        {title && (
                            <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
                                <h2 className="text-lg font-semibold text-text-primary">
                                    {title}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        )}

                        {/* Body */}
                        <div className="px-6 py-5 overflow-y-auto flex-1">
                            {children}
                        </div>

                        {/* Footer */}
                        {footer && (
                            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-subtle">
                                {footer}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>,
        document.body
    );
};

// Attach subcomponents to Modal
export const Modal = Object.assign(ModalComponent, {
    Header: ModalHeader,
    Body: ModalBody,
    Footer: ModalFooter,
});
