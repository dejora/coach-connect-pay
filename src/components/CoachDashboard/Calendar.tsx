
import React, { useState } from 'react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TimeSlot } from '@/types';
import { toast } from 'sonner';

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8AM to 7PM

const CoachCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weekStart, setWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSlotTime, setSelectedSlotTime] = useState<{ hour: number, date: Date } | null>(null);

  // Generate days of the week from the week start date
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const handlePrevWeek = () => {
    setWeekStart(subWeeks(weekStart, 1));
  };

  const handleNextWeek = () => {
    setWeekStart(addWeeks(weekStart, 1));
  };

  const handleSelectDate = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const isTimeSlotAvailable = (date: Date, hour: number): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const startTimeStr = `${dateStr}T${hour.toString().padStart(2, '0')}:00:00Z`;
    return !timeSlots.some(slot => 
      slot.startTime === startTimeStr && slot.isBooked
    );
  };

  const handleCellClick = (date: Date, hour: number) => {
    setSelectedSlotTime({ hour, date });
    setIsDialogOpen(true);
  };

  const addTimeSlot = () => {
    if (!selectedSlotTime) return;
    
    const { hour, date } = selectedSlotTime;
    const dateStr = format(date, 'yyyy-MM-dd');
    const startTime = `${dateStr}T${hour.toString().padStart(2, '0')}:00:00Z`;
    const endTime = `${dateStr}T${(hour + 1).toString().padStart(2, '0')}:00:00Z`;
    
    const newSlot: TimeSlot = {
      id: `slot-${Date.now()}`,
      coachId: 'current-user-id', // This would be the actual coach ID in a real app
      startTime,
      endTime,
      isBooked: false
    };
    
    setTimeSlots([...timeSlots, newSlot]);
    setIsDialogOpen(false);
    toast.success('Availability added successfully!');
  };

  const handleSelectHour = (hour: number) => {
    if (selectedSlotTime) {
      setSelectedSlotTime({ ...selectedSlotTime, hour });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">My Calendar</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePrevWeek}>Previous Week</Button>
          <Button variant="outline" onClick={handleNextWeek}>Next Week</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <Card className="md:col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleSelectDate}
              className="rounded-md border"
            />
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Instructions:</h3>
              <p className="text-sm text-gray-500 mb-2">1. Select a date on the calendar</p>
              <p className="text-sm text-gray-500 mb-2">2. Click on a time slot in the schedule to add your availability</p>
              <p className="text-sm text-gray-500">3. Booked appointments will appear in blue</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-8 lg:col-span-9">
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 text-left"></th>
                    {weekDays.map((day) => (
                      <th 
                        key={day.toString()} 
                        className={`border p-2 text-center min-w-[120px] ${isSameDay(day, selectedDate) ? 'bg-brand-teal/10' : ''}`}
                      >
                        <div>{format(day, 'EEE')}</div>
                        <div className="font-semibold">{format(day, 'd MMM')}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HOURS.map((hour) => (
                    <tr key={hour}>
                      <td className="border p-2 text-left font-medium">
                        {hour % 12 === 0 ? 12 : hour % 12}{hour < 12 ? 'am' : 'pm'}
                      </td>
                      {weekDays.map((day) => {
                        const isAvailable = isTimeSlotAvailable(day, hour);
                        return (
                          <td 
                            key={`${day.toString()}-${hour}`} 
                            className={`border p-2 text-center ${!isAvailable ? 'bg-gray-100' : 'hover:bg-brand-teal/20 cursor-pointer'} ${isSameDay(day, selectedDate) ? 'bg-brand-teal/5' : ''}`}
                            onClick={() => isAvailable && handleCellClick(day, hour)}
                          >
                            {!isAvailable ? (
                              <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded">Booked</span>
                            ) : (
                              <span className="text-gray-400">Available</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Availability</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">
              {selectedSlotTime && (
                <span>
                  Date: <strong>{format(selectedSlotTime.date, 'EEEE, MMMM d, yyyy')}</strong>
                  <br />
                  Time: <strong>{selectedSlotTime.hour % 12 === 0 ? 12 : selectedSlotTime.hour % 12}{selectedSlotTime.hour < 12 ? 'am' : 'pm'} - {(selectedSlotTime.hour + 1) % 12 === 0 ? 12 : (selectedSlotTime.hour + 1) % 12}{selectedSlotTime.hour + 1 < 12 ? 'am' : 'pm'}</strong>
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
    </div>
  );
};

export default CoachCalendar;
