import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AssignSiparaModalProps {
  isOpen: boolean;
  onClose: () => void;
  siparaNumber: number;
  currentName?: string;
  onAssign: (siparaNumber: number, personName: string) => void;
}

export const AssignSiparaModal = ({
  isOpen,
  onClose,
  siparaNumber,
  currentName,
  onAssign
}: AssignSiparaModalProps) => {
  const [personName, setPersonName] = useState(currentName || '');

  // Update personName when modal opens or currentName changes (when switching between different siparas)
  React.useEffect(() => {
    if (isOpen) {
      setPersonName(currentName || '');
    }
  }, [currentName, siparaNumber, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (personName.trim()) {
      onAssign(siparaNumber, personName.trim());
      onClose();
    }
  };

  const handleClose = () => {
    setPersonName(currentName || '');
    onClose();
  };

  const handleRemove = () => {
    onAssign(siparaNumber, '');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-background border border-border fixed top-4 left-1/2 transform -translate-x-1/2 translate-y-0 sm:top-1/2 sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Assign Sipara {siparaNumber}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="personName" className="text-sm font-medium text-foreground">
              Person's Name
            </Label>
            <Input
              id="personName"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              placeholder="Enter person's name"
              className="w-full"
              autoFocus
            />
          </div>
          <div className="flex gap-3 justify-between">
            {currentName ? (
              <Button
                type="button"
                variant="destructive"
                onClick={handleRemove}
                className="text-sm"
              >
                Remove
              </Button>
            ) : (
              <div></div>
            )}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!personName.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Save
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};