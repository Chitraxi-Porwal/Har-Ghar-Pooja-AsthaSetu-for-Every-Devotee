import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../utils';
import Button from './Button';

const Modal = ({
  isOpen = false,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnClickOutside = true,
  closeOnEsc = true,
  className = '',
  showCloseButton = true,
}) => {
  useEffect(() => {
    if (!closeOnEsc) return;

    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, closeOnEsc]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnClickOutside ? onClose : undefined}
          />

          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              className={cn(
                'relative my-8 w-full transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-2xl transition-all dark:bg-gray-800',
                sizeClasses[size],
                className
              )}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                  {title && (
                    <h3 className="text-xl font-bold leading-6 text-gray-900 dark:text-white">
                      {title}
                    </h3>
                  )}
                  {showCloseButton && onClose && (
                    <button
                      onClick={onClose}
                      className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700"
                    >
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close</span>
                    </button>
                  )}
                </div>
              )}

              <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">{children}</div>

              {footer && (
                <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-700/50">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
