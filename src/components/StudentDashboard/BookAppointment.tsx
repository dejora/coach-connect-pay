
import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Coach, TimeSlot, Appointment } from '@/types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { createCheckoutSession } from '@/services/stripe';
import { useTranslation } from 'react-i18next';

interface BookAppointmentProps {
  coachId?: string;
}

const BookAppointment: React.FC<BookAppointmentProps> = ({ coachId = 'coach-1' }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [coach, setCoach] = useState<Coach | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);

  // Fetch coach details
  useEffect(() => {
    const fetchCoachDetails = async () => {
      try {
        // In a real app, this would fetch from your profiles table
        // For now, we're using mock data
        setCoach({
          id: coachId,
          name: 'Dr. Jane Smith',
          email: 'jane.smith@example.com',
          role: 'coach',
          bio: 'Expert mathematics tutor with over 10 years of teaching experience.',
          hourlyRate: 60,
          expertise: ['Mathematics', 'Statistics', 'Data Science'],
          rating: 4.9,
        });
      } catch (error) {
        console.error('Error fetching coach details:', error);
        toast.error(t('errors.failedToLoadCoachDetails'));
      }
    };

    fetchCoachDetails();
  }, [coachId, t]);

  // Fetch available time slots for the selected date
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedDate) return;
      
      setIsLoading(true);
      try {
        // Format date to match database format (start and end of day)
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        const { data, error } = await supabase
          .from('coach_time_slots')
          .select('*')
          .eq('coach_id', coachId)
          .eq('is_booked', false)
          .gte('start_time', startOfDay.toISOString())
          .lte('start_time', endOfDay.toISOString());

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

        setAvailableSlots(formattedSlots);
      } catch (error) {
        console.error('Error fetching available slots:', error);
        toast.error(t('errors.failedToLoadTimeSlots'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [selectedDate, coachId, t]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setIsDialogOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot || !user || !coach) {
      toast.error(t('errors.missingBookingInfo'));
      return;
    }

    try {
      setIsProcessing(true);
      setIsDialogOpen(false);
      
      // Create Stripe checkout session
      const sessionDate = format(parseISO(selectedSlot.startTime), 'yyyy-MM-dd HH:mm:ss');
      const { url } = await createCheckoutSession(
        coach.id,
        sessionDate,
        coach.hourlyRate * 100 // Convert to cents for Stripe
      );
      
      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error(t('errors.paymentFailed'), {
        description: t('errors.paymentProcessingError'),
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter slots for the selected date (filter is now handled by the database query)
  const filteredSlots = availableSlots;

  if (!coach) {
    return (
      <div className="flex justify-center p-8">
        <p>{t('loading.coachDetails')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">{t('appointment.bookAppointment')}</h2>
        <p className="text-gray-500">{t('appointment.selectDateAndTime', { coachName: coach.name })}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <Card className="md:col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>{t('coach.profile')}</CardTitle>
            <CardDescription>{t('coach.reviewDetails')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 rounded-full bg-yellow-300/20 flex items-center justify-center text-yellow-500 text-xl font-bold">
                {coach.name.substring(0, 1)}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{coach.name}</h3>
                <div className="flex items-center text-sm">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1">{coach.rating} {t('coach.rating')}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-1">{t('coach.expertise')}</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {coach.expertise.map((skill, index) => (
                  <span 
                    key={index} 
                    className="bg-yellow-300/10 text-yellow-700 px-2 py-1 rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-1">{t('coach.hourlyRate')}</h4>
              <p className="text-xl font-bold text-yellow-500">${coach.hourlyRate}/{t('time.hr')}</p>
            </div>

            <div>
              <h4 className="font-medium mb-1">{t('coach.bio')}</h4>
              <p className="text-sm text-gray-600">{coach.bio}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-8 lg:col-span-9">
          <CardHeader>
            <CardTitle>{t('appointment.selectDateTime')}</CardTitle>
            <CardDescription>
              {t('appointment.chooseAvailableSlot')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">{t('appointment.selectDate')}</h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="rounded-md border pointer-events-auto"
                />
              </div>

              <div>
                <h3 className="font-medium mb-2">{t('appointment.availableTimeSlots')}</h3>
                {isLoading ? (
                  <div className="flex justify-center p-8">
                    <p>{t('loading.availableSlots')}</p>
                  </div>
                ) : filteredSlots.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {filteredSlots.map((slot) => (
                      <Button
                        key={slot.id}
                        variant="outline"
                        className="justify-start"
                        onClick={() => handleSlotSelect(slot)}
                      >
                        {format(parseISO(slot.startTime), 'h:mm a')} - 
                        {format(parseISO(slot.endTime), 'h:mm a')}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center border rounded-md p-6 h-[200px]">
                    <p className="text-gray-500">{t('appointment.noAvailableSlots')}</p>
                    <p className="text-sm text-gray-400 mt-1">{t('appointment.selectAnotherDate')}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] pointer-events-auto">
          <DialogHeader>
            <DialogTitle>{t('appointment.confirmAppointment')}</DialogTitle>
            <DialogDescription>
              {t('appointment.reviewAppointmentDetails')}
            </DialogDescription>
          </DialogHeader>
          {selectedSlot && (
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">{t('coach.label')}</p>
                <p>{coach.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{t('appointment.date')}</p>
                <p>{format(parseISO(selectedSlot.startTime), 'EEEE, MMMM d, yyyy')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{t('appointment.time')}</p>
                <p>
                  {format(parseISO(selectedSlot.startTime), 'h:mm a')} - 
                  {format(parseISO(selectedSlot.endTime), 'h:mm a')}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{t('payment.fee')}</p>
                <p className="text-lg font-bold">${coach.hourlyRate}.00</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleConfirmBooking} disabled={isProcessing}>
              {isProcessing ? t('payment.processing') : t('payment.proceedToPayment')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookAppointment;
