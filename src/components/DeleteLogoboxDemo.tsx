import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DeleteLogobox } from './DeleteLogobox';

export const DeleteLogoboxDemo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [variant, setVariant] = useState<'default' | 'dangerous' | 'warning'>('dangerous');
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');

  const handleDelete = () => {
    console.log('Item deleted!');
    // Your delete logic here
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">DeleteLogobox Demo</h2>
        <p className="text-muted-foreground">Test different variants and sizes</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="space-y-2">
          <label className="text-sm font-medium">Variant:</label>
          <div className="flex gap-2">
            {(['default', 'dangerous', 'warning'] as const).map((v) => (
              <Button
                key={v}
                variant={variant === v ? 'default' : 'outline'}
                size="sm"
                onClick={() => setVariant(v)}
              >
                {v}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Size:</label>
          <div className="flex gap-2">
            {(['sm', 'md', 'lg'] as const).map((s) => (
              <Button
                key={s}
                variant={size === s ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSize(s)}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Test Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          variant="destructive"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2"
        >
          Test Delete Dialog
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            setVariant('warning');
            setSize('lg');
            setIsOpen(true);
          }}
        >
          Test Warning (Large)
        </Button>
      </div>

      {/* DeleteLogobox */}
      <DeleteLogobox
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Delete expense?"
        message="This action cannot be undone. The expense will be permanently removed."
        itemName="Headphone"
        variant={variant}
        size={size}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default DeleteLogoboxDemo;
