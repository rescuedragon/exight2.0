import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface DeleteLogoboxProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'dangerous' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const DeleteLogobox: React.FC<DeleteLogoboxProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete item?',
  message = 'This action cannot be undone. The item will be permanently removed.',
  itemName,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  variant = 'dangerous',
  size = 'md',
  className,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'dangerous':
        return {
          icon: 'text-red-500',
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white border-red-600',
          title: 'text-red-900 dark:text-red-100',
        };
      case 'warning':
        return {
          icon: 'text-amber-500',
          confirmButton: 'bg-amber-600 hover:bg-amber-700 text-white border-amber-600',
          title: 'text-amber-900 dark:text-amber-100',
        };
      default:
        return {
          icon: 'text-gray-500',
          confirmButton: 'bg-gray-600 hover:bg-gray-700 text-white border-gray-600',
          title: 'text-gray-900 dark:text-gray-100',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'max-w-md',
          padding: 'p-4',
          icon: 'w-8 h-8',
          title: 'text-lg',
          message: 'text-sm',
        };
      case 'lg':
        return {
          container: 'max-w-2xl',
          padding: 'p-8',
          icon: 'w-16 h-16',
          title: 'text-2xl',
          message: 'text-base',
        };
      default: // md
        return {
          container: 'max-w-lg',
          padding: 'p-6',
          icon: 'w-12 h-12',
          title: 'text-xl',
          message: 'text-sm',
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] animate-in fade-in-0 duration-100" />

      {/* Modal */}
      <div className={cn('relative z-[10000] w-full mx-4', sizeStyles.container, className)}>
        <div
          className={cn(
            'bg-card border border-border/40 rounded-[28px] shadow-2xl overflow-hidden',
            'animate-in zoom-in-95 fade-in-0 duration-100',
            sizeStyles.padding,
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800',
                  variantStyles.icon,
                  sizeStyles.icon,
                )}
              >
                <AlertTriangle className="w-1/2 h-1/2" />
              </div>
              <div>
                <h3
                  className={cn(
                    'font-semibold leading-tight',
                    variantStyles.title,
                    sizeStyles.title,
                  )}
                >
                  {title}
                </h3>
                {itemName && <p className="text-sm text-muted-foreground mt-1">"{itemName}"</p>}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Message */}
          <div className="mb-6">
            <p className={cn('text-muted-foreground leading-relaxed', sizeStyles.message)}>
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 sm:flex-none border-border/40 hover:bg-accent/50 transition-colors duration-100"
            >
              {cancelText}
            </Button>
            <Button
              onClick={handleConfirm}
              className={cn(
                'flex-1 sm:flex-none transition-all duration-100',
                variantStyles.confirmButton,
              )}
            >
              <Trash2 className="w-4 h-4" />
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteLogobox;
