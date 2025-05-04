
import React from 'react';
import CalendarHeader from './CalendarHeader';
import WeeklySchedule from './WeeklySchedule';
import DateSelector from './DateSelector';
import { Card } from '@/components/ui/card';
import TimeSlotDialog from './TimeSlotDialog';
import { useCalendarState } from './useCalendarState';

const CoachCalendar: React.FC = () => {
  const {
    user,
    selectedDate,
    weekStart,
    timeSlots,
    isDialogOpen,
    selectedSlotTime,
    isLoading,
    handlePrevWeek,
    handleNextWeek,
    handleSelectDate,
    handleCellClick,
    addTimeSlot,
    setIsDialogOpen
  } = useCalendarState();

  if (!user) {
    return (
      <div className="text-center p-8">
        <p>Please log in to manage your calendar</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CalendarHeader 
        handlePrevWeek={handlePrevWeek} 
        handleNextWeek={handleNextWeek} 
      />

      {isLoading ? (
        <div className="flex justify-center p-8">
          <p>Loading your schedule...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <DateSelector 
            selectedDate={selectedDate}
            handleSelectDate={handleSelectDate}
          />

          <WeeklySchedule 
            weekStart={weekStart}
            timeSlots={timeSlots}
            selectedDate={selectedDate}
            handleCellClick={handleCellClick}
          />
        </div>
      )}

      <TimeSlotDialog 
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        selectedSlotTime={selectedSlotTime}
        addTimeSlot={addTimeSlot}
      />
    </div>
  );
};

export default CoachCalendar;
