
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, parseISO } from 'date-fns';
import { useSitePreferences } from '@/hooks/useSitePreferences';
import { Skeleton } from '@/components/ui/skeleton';

// Mock appointments data - in a real app, this would be fetched from your API
const MOCK_APPOINTMENTS = [
  {
    id: 'appt-1',
    coachId: 'coach-1',
    coachName: 'Dr. Jane Smith',
    studentId: 'student-1',
    studentName: 'Alex Johnson',
    date: '2023-05-20',
    startTime: '10:00',
    endTime: '11:00',
    topic: 'Calculus',
    status: 'confirmed',
    paymentStatus: 'paid',
  },
  {
    id: 'appt-2',
    coachId: 'coach-1',
    coachName: 'Dr. Jane Smith',
    studentId: 'student-2',
    studentName: 'Sam Wilson',
    date: '2023-05-21',
    startTime: '14:00',
    endTime: '15:00',
    topic: 'Statistics',
    status: 'confirmed',
    paymentStatus: 'paid',
  },
  {
    id: 'appt-3',
    coachId: 'coach-2',
    coachName: 'Prof. Robert Chen',
    studentId: 'student-1',
    studentName: 'Alex Johnson',
    date: '2023-05-22',
    startTime: '11:00',
    endTime: '12:00',
    topic: 'Physics',
    status: 'cancelled',
    paymentStatus: 'refunded',
  },
  {
    id: 'appt-4',
    coachId: 'coach-3',
    coachName: 'Lisa Johnson',
    studentId: 'student-1',
    studentName: 'Alex Johnson',
    date: '2023-06-01',
    startTime: '15:00',
    endTime: '16:00',
    topic: 'Chemistry',
    status: 'pending',
    paymentStatus: 'pending',
  },
];

const AppointmentCard: React.FC<{ appointment: any; isCoach: boolean }> = ({ 
  appointment, 
  isCoach 
}) => {
  const otherPersonName = isCoach ? appointment.studentName : appointment.coachName;
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{appointment.topic}</h3>
            <p className="text-sm text-gray-500">with {otherPersonName}</p>
            <div className="mt-2">
              <p className="text-sm">
                {format(parseISO(`${appointment.date}T00:00:00`), 'EEEE, MMMM d, yyyy')}
              </p>
              <p className="text-sm">
                {appointment.startTime} - {appointment.endTime}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
              appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              appointment.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 
              appointment.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-gray-100 text-gray-800'
            }`}>
              {appointment.paymentStatus.charAt(0).toUpperCase() + appointment.paymentStatus.slice(1)}
            </span>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Link to={`/appointment/${appointment.id}`}>
            <Button variant="outline" size="sm">View Details</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

const AppointmentsPage: React.FC = () => {
  const { user } = useAuth();
  const { isLoading: prefsLoading, isMaintenanceMode } = useSitePreferences();
  const [isMaintenanceActive, setIsMaintenanceActive] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if maintenance mode is active
    if (!prefsLoading) {
      setIsMaintenanceActive(isMaintenanceMode());
    }
  }, [prefsLoading, isMaintenanceMode]);
  
  // Filter appointments based on the user's role
  const userAppointments = MOCK_APPOINTMENTS.filter(appointment => {
    if (user?.role === 'coach') {
      return appointment.coachId === 'coach-1'; // Mock coach ID
    } else {
      return appointment.studentId === 'student-1'; // Mock student ID
    }
  });
  
  const upcomingAppointments = userAppointments.filter(
    appointment => appointment.status !== 'cancelled' && parseISO(`${appointment.date}T00:00:00`) >= new Date()
  );
  
  const pastAppointments = userAppointments.filter(
    appointment => appointment.status === 'cancelled' || parseISO(`${appointment.date}T00:00:00`) < new Date()
  );

  const isCoach = user?.role === 'coach';

  if (prefsLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isMaintenanceActive) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4 flex flex-col items-center justify-center">
            <div className="max-w-md text-center">
              <h2 className="text-2xl font-bold mb-4">Maintenance Mode</h2>
              <p className="mb-6">
                The appointments system is currently undergoing maintenance. 
                Please check back later.
              </p>
              <Link to="/dashboard">
                <Button>Return to Dashboard</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">My Appointments</h1>
          
          <Tabs defaultValue="upcoming" className="space-y-4">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past & Cancelled</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="space-y-4">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map(appointment => (
                  <AppointmentCard 
                    key={appointment.id} 
                    appointment={appointment} 
                    isCoach={isCoach}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500">You have no upcoming appointments.</p>
                    {!isCoach && (
                      <div className="mt-4">
                        <Link to="/dashboard">
                          <Button>Book a Session</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="past" className="space-y-4">
              {pastAppointments.length > 0 ? (
                pastAppointments.map(appointment => (
                  <AppointmentCard 
                    key={appointment.id} 
                    appointment={appointment} 
                    isCoach={isCoach}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500">You have no past or cancelled appointments.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
          
          {isCoach && (
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Manage Your Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-600">Update your availability and appointment settings.</p>
                  <Link to="/calendar">
                    <Button>Go to Calendar</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AppointmentsPage;
