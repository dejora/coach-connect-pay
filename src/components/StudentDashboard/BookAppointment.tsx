
import React, { useState } from 'react';
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

// Mock data
const MOCK_COACH: Coach = {
  id: 'coach-1',
  name: 'Dr. Jane Smith',
  email: 'jane.smith@example.com',
  role: 'coach',
  bio: 'Expert mathematics tutor with over 10 years of teaching experience.',
  hourlyRate: 60,
  expertise: ['Mathematics', 'Statistics', 'Data Science'],
  rating: 4.9,
};

const MOCK_AVAILABLE_SLOTS: TimeSlot[] = [
  {
    id: 'slot-1',
    coachId: 'coach-1',
    startTime: '2023-05-20T10:00:00Z',
    endTime: '2023-05-20T11:00:00Z',
    isBooked: false,
  },
  {
    id: 'slot-2',
    coachId: 'coach-1',
    startTime: '2023-05-20T14:00:00Z',
    endTime: '2023-05-20T15:00:00Z',
    isBooked: false,
  },
  {
    id: 'slot-3',
    coachId: 'coach-1',
    startTime: '2023-05-21T09:00:00Z',
    endTime: '2023-05-21T10:00:00Z',
    isBooked: false,
  },
  {
    id: 'slot-4',
    coachId: 'coach-1',
    startTime: '2023-05-21T13:00:00Z',
    endTime: '2023-05-21T14:00:00Z',
    isBooked: false,
  },
];

interface BookAppointmentProps {
  coachId?: string; // In a real app, this would be required
}

const BookAppointment: React.FC<BookAppointmentProps> = ({ coachId = 'coach-1' }) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // In a real app, these would be fetched from your API
  const coach = MOCK_COACH;
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>(MOCK_AVAILABLE_SLOTS);
  
  // Filter slots for the selected date
  const filteredSlots = availableSlots.filter(slot => {
    const slotDate = parseISO(slot.startTime);
    return (
      slotDate.getFullYear() === selectedDate.getFullYear() &&
      slotDate.getMonth() === selectedDate.getMonth() &&
      slotDate.getDate() === selectedDate.getDate()
    );
  });

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setIsDialogOpen(true);
  };

  const handleConfirmBooking = () => {
    setIsDialogOpen(false);
    setIsPaymentDialogOpen(true);
  };

  const handleProcessPayment = async () => {
    try {
      setIsProcessing(true);
      
      // In a real app, you would:
      // 1. Call your Stripe integration to process payment
      // 2. Create an appointment record in your database
      // 3. Update the time slot to show it's booked
      // 4. Send notifications to the coach and student
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update local state to mark the slot as booked
      if (selectedSlot) {
        setAvailableSlots(availableSlots.map(slot => 
          slot.id === selectedSlot.id ? { ...slot, isBooked: true } : slot
        ));
      }
      
      setIsPaymentDialogOpen(false);
      
      // Show success message
      toast.success('Appointment booked successfully!', {
        description: 'Check your email for confirmation details.',
      });
      
      // In a real app, redirect to appointment confirmation page
      navigate('/appointments');
    } catch (error) {
      toast.error('Payment failed', {
        description: 'There was an error processing your payment. Please try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Book an Appointment</h2>
        <p className="text-gray-500">Select a date and available time slot to book with {coach.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <Card className="md:col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Coach Profile</CardTitle>
            <CardDescription>Review coach details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal text-xl font-bold">
                {coach.name.substring(0, 1)}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{coach.name}</h3>
                <div className="flex items-center text-sm">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1">{coach.rating} rating</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-1">Expertise</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {coach.expertise.map((skill, index) => (
                  <span 
                    key={index} 
                    className="bg-brand-teal/10 text-brand-teal px-2 py-1 rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-1">Hourly Rate</h4>
              <p className="text-xl font-bold text-brand-blue">${coach.hourlyRate}/hr</p>
            </div>

            <div>
              <h4 className="font-medium mb-1">Bio</h4>
              <p className="text-sm text-gray-600">{coach.bio}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-8 lg:col-span-9">
          <CardHeader>
            <CardTitle>Select Date & Time</CardTitle>
            <CardDescription>
              Choose an available time slot for your appointment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Select a Date</h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="rounded-md border"
                />
              </div>

              <div>
                <h3 className="font-medium mb-2">Available Time Slots</h3>
                {filteredSlots.length > 0 ? (
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
                    <p className="text-gray-500">No available slots on this date</p>
                    <p className="text-sm text-gray-400 mt-1">Please select another date</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Appointment</DialogTitle>
            <DialogDescription>
              Please review the appointment details before proceeding to payment.
            </DialogDescription>
          </DialogHeader>
          {selectedSlot && (
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Coach</p>
                <p>{coach.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Date</p>
                <p>{format(parseISO(selectedSlot.startTime), 'EEEE, MMMM d, yyyy')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Time</p>
                <p>
                  {format(parseISO(selectedSlot.startTime), 'h:mm a')} - 
                  {format(parseISO(selectedSlot.endTime), 'h:mm a')}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Fee</p>
                <p className="text-lg font-bold">${coach.hourlyRate}.00</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmBooking}>
              Proceed to Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Enter your payment information to complete the booking.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border rounded-md p-4 bg-gray-50">
              <p className="text-sm font-medium mb-2">Appointment Summary</p>
              {selectedSlot && (
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-gray-500">Coach:</span> {coach.name}
                  </p>
                  <p>
                    <span className="text-gray-500">Date:</span> {format(parseISO(selectedSlot.startTime), 'MMM d, yyyy')}
                  </p>
                  <p>
                    <span className="text-gray-500">Time:</span> {format(parseISO(selectedSlot.startTime), 'h:mm a')} - {format(parseISO(selectedSlot.endTime), 'h:mm a')}
                  </p>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between items-center mt-2">
                <span className="font-medium">Total</span>
                <span className="font-bold">${coach.hourlyRate}.00</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Card Information</p>
              <div className="border p-3 rounded-md bg-white">
                <p className="text-sm text-gray-500 mb-1">Card Number</p>
                <p className="font-mono">•••• •••• •••• 4242</p>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              This is a demo application. No actual payment will be processed.
              In a real application, this would integrate with Stripe.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleProcessPayment} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Complete Payment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookAppointment;
