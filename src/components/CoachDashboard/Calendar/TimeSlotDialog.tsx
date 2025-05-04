
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TimeSlotDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  selectedSlotTime: { hour: number, date: Date } | null;
  addTimeSlot: () => Promise<void>;
}

const TimeSlotDialog: React.FC<TimeSlotDialogProps> = ({ 
  isDialogOpen, 
  setIsDialogOpen, 
  selectedSlotTime,
  addTimeSlot 
}) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[425px] pointer-events-auto">
        <DialogHeader>
          <DialogTitle>Add Availability</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4">
            {selectedSlotTime && (
              <span>
                Date: <strong>{format(selectedSlotTime.date, 'EEEE, MMMM d, yyyy')}</strong>
                <br />
                Time: <strong>
                  {selectedSlotTime.hour % 12 === 0 ? 12 : selectedSlotTime.hour % 12}
                  {selectedSlotTime.hour < 12 ? 'am' : 'pm'} - 
                  {(selectedSlotTime.hour + 1) % 12 === 0 ? 12 : (selectedSlotTime.hour + 1) % 12}
                  {selectedSlotTime.hour + 1 < 12 ? 'am' : 'pm'}
                </strong>
              </span>
            )}
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Make this time slot available?</span>
              <Button onClick={addTimeSlot}>Confirm</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimeSlotDialog;
