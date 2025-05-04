
import React from 'react';
import { format, addDays, isSameDay, isBefore } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TimeSlot } from '@/types';

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8AM to 7PM

interface WeeklyScheduleProps {
  weekStart: Date;
  timeSlots: TimeSlot[];
  selectedDate: Date;
  handleCellClick: (date: Date, hour: number) => void;
}

const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({
  weekStart,
  timeSlots,
  selectedDate,
  handleCellClick
}) => {
  // Generate days of the week from the week start date
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const isTimeSlotAvailable = (date: Date, hour: number): boolean => {
    // Format date to match the format stored in timeSlots
    const dateStr = format(date, 'yyyy-MM-dd');
    const startTimeStr = `${dateStr}T${hour.toString().padStart(2, '0')}:00:00Z`;
    
    return timeSlots.some(slot => 
      slot.startTime === startTimeStr && !slot.isBooked
    );
  };

  const isPastDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isBefore(date, today);
  };

  const isPastHour = (date: Date, hour: number): boolean => {
    const now = new Date();
    const slotDate = new Date(date);
    slotDate.setHours(hour, 0, 0, 0);
    return isBefore(slotDate, now);
  };

  return (
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
                    className={`border p-2 text-center min-w-[120px] ${isSameDay(day, selectedDate) ? 'bg-yellow-300/10' : ''}`}
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
                    const isPast = isPastDate(day) || isPastHour(day, hour);
                    const isAvailable = isTimeSlotAvailable(day, hour);
                    return (
                      <td 
                        key={`${day.toString()}-${hour}`} 
                        className={`border p-2 text-center 
                          ${isPast ? 'bg-gray-200 cursor-not-allowed' : 
                            (isAvailable ? 'bg-yellow-300/20 hover:bg-yellow-300/30' : 'bg-gray-100 hover:bg-gray-200 cursor-pointer')
                          } 
                          ${isSameDay(day, selectedDate) ? 'bg-yellow-300/5' : ''}`}
                        onClick={() => !isPast && handleCellClick(day, hour)}
                      >
                        {isAvailable ? (
                          <span className="inline-block bg-yellow-500 text-white text-xs px-2 py-1 rounded">Available</span>
                        ) : (
                          <span className="text-gray-500">Unavailable</span>
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
  );
};

export default WeeklySchedule;
