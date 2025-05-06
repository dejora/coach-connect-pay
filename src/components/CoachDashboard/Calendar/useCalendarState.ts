
import { useState, useEffect } from 'react';
import { startOfWeek, addWeeks, subWeeks, format, isBefore, parseISO } from 'date-fns';
import { TimeSlot } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/services/data/DataContext';

export const useCalendarState = () => {
  const { user } = useAuth();
  const { dataProvider } = useData();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weekStart, setWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSlotTime, setSelectedSlotTime] = useState<{ hour: number, date: Date } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch time slots from data provider when component mounts or week changes
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // Calculate the week's start and end dates for query
        const weekStartISO = weekStart.toISOString();
        const weekEndISO = addWeeks(weekStart, 1).toISOString();

        const slots = await dataProvider.timeSlots.getTimeSlotsByCoach(
          user.id,
          weekStartISO,
          weekEndISO
        );

        setTimeSlots(slots);
      } catch (error) {
        console.error('Error fetching time slots:', error);
        toast.error('Failed to load your schedule');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimeSlots();
  }, [weekStart, user, dataProvider]);

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
        // If it exists, just delete it (toggle availability)
        await dataProvider.timeSlots.deleteTimeSlot(existingSlot.id);
        
        // Update local state by removing the slot
        setTimeSlots(timeSlots.filter(slot => slot.id !== existingSlot.id));
        toast.success('Time slot removed');
      } else {
        // If it doesn't exist, create a new one
        const newSlot = await dataProvider.timeSlots.createTimeSlot({
          coachId: user.id,
          startTime: startTime,
          endTime: endTime,
          isBooked: false
        });
        
        // Add new slot to local state
        setTimeSlots([...timeSlots, newSlot]);
        toast.success('Availability added successfully!');
      }
    } catch (error) {
      console.error('Error saving time slot:', error);
      toast.error('Failed to update availability');
    } finally {
      setIsDialogOpen(false);
    }
  };

  return {
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
    isPastDate,
    isPastHour,
    handleCellClick,
    addTimeSlot,
    setIsDialogOpen
  };
};
