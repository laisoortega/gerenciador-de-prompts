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
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel
                            onClick={(e) => e.stopPropagation()}
                            className={clsx(
                                "w-full rounded-2xl bg-bg-surface shadow-xl ring-1 ring-white/10 overflow-hidden flex flex-col max-h-[90vh]",
                                {
                                    'max-w-sm': size === 'sm',
                                    'max-w-md': size === 'md',
                                    'max-w-2xl': size === 'lg',
                                    'max-w-4xl': size === 'xl',
                                }
                            )}
                        >
                            <div className="absolute right-4 top-4 z-10">
                                <button
                                    onClick={onClose}
                                    className="p-1 rounded-full text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
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
    <div className={clsx("p-6 border-b border-border-subtle", className)}>
        {children}
    </div>
)

Modal.Body = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={clsx("p-6 overflow-y-auto", className)}>
        {children}
    </div>
)

Modal.Footer = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={clsx("p-6 border-t border-border-subtle flex justify-end gap-3 bg-bg-surface", className)}>
        {children}
    </div>
)
