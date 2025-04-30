
import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay, isBefore, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TimeSlot } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8AM to 7PM

const CoachCalendar: React.FC = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weekStart, setWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSlotTime, setSelectedSlotTime] = useState<{ hour: number, date: Date } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Generate days of the week from the week start date
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Fetch time slots from Supabase when component mounts or week changes
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // Calculate the week's start and end dates for query
        const weekStartISO = weekStart.toISOString();
        const weekEndISO = addDays(weekStart, 7).toISOString();

        const { data, error } = await supabase
          .from('coach_time_slots')
          .select('*')
          .eq('coach_id', user.id)
          .gte('start_time', weekStartISO)
          .lt('start_time', weekEndISO);

        if (error) {
          throw error;
        }

        // Transform Supabase data to match our TimeSlot type
        const formattedSlots: TimeSlot[] = data.map((slot) => ({
          id: slot.id,
          coachId: slot.coach_id,
          startTime: slot.start_time,
          endTime: slot.end_time,
          isBooked: slot.is_booked,
        }));

        setTimeSlots(formattedSlots);
      } catch (error) {
        console.error('Error fetching time slots:', error);
        toast.error('Failed to load your schedule');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimeSlots();
  }, [weekStart, user]);

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

  const handleCellClick = (date: Date, hour: number) => {
    // Prevent changing slots in past dates
    if (isPastDate(date) || isPastHour(date, hour)) {
      toast.error("Cannot modify slots in the past");
      return;
    }

    setSelectedSlotTime({ hour, date });
    setIsDialogOpen(true);
  };

  const addTimeSlot = async () => {
    if (!selectedSlotTime || !user) return;
    
    const { hour, date } = selectedSlotTime;
    const dateStr = format(date, 'yyyy-MM-dd');
    const startTime = `${dateStr}T${hour.toString().padStart(2, '0')}:00:00Z`;
    const endTime = `${dateStr}T${(hour + 1).toString().padStart(2, '0')}:00:00Z`;
    
    try {
      // Check if a slot already exists for this time
      const existingSlot = timeSlots.find(slot => slot.startTime === startTime);
      
      if (existingSlot) {
        // If it exists, just update it (toggle availability)
        const { error } = await supabase
          .from('coach_time_slots')
          .delete()
          .eq('id', existingSlot.id);
        
        if (error) throw error;
        
        // Update local state by removing the slot
        setTimeSlots(timeSlots.filter(slot => slot.id !== existingSlot.id));
        toast.success('Time slot removed');
      } else {
        // If it doesn't exist, create a new one
        const { data, error } = await supabase
          .from('coach_time_slots')
          .insert([
            {
              coach_id: user.id,
              start_time: startTime,
              end_time: endTime,
              is_booked: false
            }
          ])
          .select();
        
        if (error) throw error;
        
        // Add new slot to local state
        if (data && data.length > 0) {
          const newSlot: TimeSlot = {
            id: data[0].id,
            coachId: data[0].coach_id,
            startTime: data[0].start_time,
            endTime: data[0].end_time,
            isBooked: data[0].is_booked
          };
          setTimeSlots([...timeSlots, newSlot]);
        }
        toast.success('Availability added successfully!');
      }
    } catch (error) {
      console.error('Error saving time slot:', error);
      toast.error('Failed to update availability');
    } finally {
      setIsDialogOpen(false);
    }
  };

  const handleSelectHour = (hour: number) => {
    if (selectedSlotTime) {
      setSelectedSlotTime({ ...selectedSlotTime, hour });
    }
  };

  if (!user) {
    return (
      <div className="text-center p-8">
        <p>Please log in to manage your calendar</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">My Calendar</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePrevWeek}>Previous Week</Button>
          <Button variant="outline" onClick={handleNextWeek}>Next Week</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <p>Loading your schedule...</p>
        </div>
      ) : (
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
        </div>
      )}

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
