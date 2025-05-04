
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';

interface DateSelectorProps {
  selectedDate: Date;
  handleSelectDate: (date: Date | undefined) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ 
  selectedDate, 
  handleSelectDate 
}) => {
  // Helper function to check if a date is in the past
  const isPastDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <Card className="md:col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle>Select Date</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelectDate}
          className="rounded-md border pointer-events-auto"
          disabled={(date) => isPastDate(date)}
        />
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Instructions:</h3>
          <p className="text-sm text-gray-500 mb-2">1. Select a date on the calendar</p>
          <p className="text-sm text-gray-500 mb-2">2. Click on a time slot in the schedule to add your availability</p>
          <p className="text-sm text-gray-500">3. Slots are unavailable by default - click to make them available</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DateSelector;
