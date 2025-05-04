
import React from 'react';
import { Button } from '@/components/ui/button';

interface CalendarHeaderProps {
  handlePrevWeek: () => void;
  handleNextWeek: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ 
  handlePrevWeek, 
  handleNextWeek 
}) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-semibold">My Calendar</h2>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={handlePrevWeek}>Previous Week</Button>
        <Button variant="outline" onClick={handleNextWeek}>Next Week</Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
