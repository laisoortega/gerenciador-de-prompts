import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import clsx from 'clsx'

interface ModalProps {
    open?: boolean;
    onClose: () => void;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ open = true, onClose, children, size = 'md' }: ModalProps) {
    return (
        <Transition show={open} as={Fragment}>
            <Dialog onClose={onClose} className="relative z-50">
                {/* Backdrop */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                {/* Container */}
                <div className="fixed inset-0 flex w-screen items-end md:items-center justify-center md:p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-full md:translate-y-0 md:scale-95"
                        enterTo="opacity-100 translate-y-0 md:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 md:scale-100"
                        leaveTo="opacity-0 translate-y-full md:translate-y-0 md:scale-95"
                    >
                        <Dialog.Panel
                            onClick={(e) => e.stopPropagation()}
                            className={clsx(
                                // Base styles
                                "w-full bg-bg-surface shadow-xl ring-1 ring-white/10 overflow-hidden flex flex-col",
                                // Mobile: full height, rounded top only
                                "h-[95vh] rounded-t-2xl",
                                // Desktop: auto height, fully rounded, max-height limited
                                "md:h-auto md:rounded-2xl md:max-h-[90vh]",
                                // Size variants (only apply on desktop)
                                {
                                    'md:max-w-sm': size === 'sm',
                                    'md:max-w-md': size === 'md',
                                    'md:max-w-2xl': size === 'lg',
                                    'md:max-w-4xl': size === 'xl',
                                }
                            )}
                        >
                            {/* Mobile drag handle */}
                            <div className="md:hidden flex justify-center py-2 bg-bg-surface">
                                <div className="w-10 h-1 rounded-full bg-border-default" />
                            </div>

                            {/* Close button */}
                            <div className="absolute right-3 top-3 md:right-4 md:top-4 z-10">
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors touch-target flex items-center justify-center"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            {children}
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    )
}

Modal.Header = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={clsx("p-4 md:p-6 border-b border-border-subtle pr-12", className)}>
        {children}
    </div>
)

Modal.Body = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={clsx("flex-1 overflow-y-auto scroll-mobile", className)}>
        {children}
    </div>
)

Modal.Footer = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={clsx("p-4 md:p-6 border-t border-border-subtle flex justify-end gap-3 bg-bg-surface pb-safe", className)}>
        {children}
    </div>
)
