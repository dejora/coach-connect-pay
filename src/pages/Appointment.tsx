
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

// Mock appointment data - in a real app, this would be fetched from your API
const MOCK_APPOINTMENT = {
  id: 'appt-123',
  coachName: 'Dr. Jane Smith',
  coachEmail: 'jane.smith@example.com',
  studentName: 'Alex Johnson',
  studentEmail: 'alex.johnson@example.com',
  date: 'May 20, 2023',
  startTime: '10:00 AM',
  endTime: '11:00 AM',
  topic: 'Advanced Mathematics',
  status: 'confirmed',
  paymentStatus: 'paid',
  amount: 60,
  notes: 'Preparing for calculus exam'
};

const AppointmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // In a real app, you would fetch the appointment data based on the ID from the URL
  const appointment = MOCK_APPOINTMENT;
  
  // Determine if the current user is the coach or student in this appointment
  const isCoach = user?.role === 'coach';
  const otherPersonName = isCoach ? appointment.studentName : appointment.coachName;
  
  const handleCancelAppointment = async () => {
    try {
      setIsLoading(true);
      // In a real app, you would make an API call to cancel the appointment
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      
      toast.success('Appointment cancelled successfully', {
        description: 'The other party has been notified of this cancellation.'
      });
      
      navigate('/appointments');
    } catch (error) {
      toast.error('Failed to cancel appointment', {
        description: 'Please try again or contact support.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Appointment Details</h1>
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Session with {otherPersonName}</CardTitle>
                    <CardDescription>
                      {appointment.date} • {appointment.startTime} - {appointment.endTime}
                    </CardDescription>
                  </div>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                      appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Coach</h3>
                    <p className="font-medium">{appointment.coachName}</p>
                    <p className="text-sm text-gray-500">{appointment.coachEmail}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Student</h3>
                    <p className="font-medium">{appointment.studentName}</p>
                    <p className="text-sm text-gray-500">{appointment.studentEmail}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Session Topic</h3>
                  <p>{appointment.topic}</p>
                </div>

                {appointment.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Notes</h3>
                    <p className="text-gray-600">{appointment.notes}</p>
                  </div>
                )}

                <Separator />

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Payment Information</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <p>Amount: ${appointment.amount}.00</p>
                      <p className="text-sm text-gray-500">Status: {appointment.paymentStatus}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      appointment.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 
                      appointment.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {appointment.paymentStatus.charAt(0).toUpperCase() + appointment.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => navigate('/appointments')}>
                  Back to Appointments
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleCancelAppointment}
                  disabled={isLoading}
                >
                  {isLoading ? 'Cancelling...' : 'Cancel Appointment'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AppointmentPage;
