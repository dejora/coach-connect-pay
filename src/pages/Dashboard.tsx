
import React from 'react';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import CoachCalendar from '@/components/CoachDashboard/Calendar';
import CoachProfile from '@/components/CoachDashboard/Profile';
import BookAppointment from '@/components/StudentDashboard/BookAppointment';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, isLoading } = useAuth();

  // If the auth is still loading, show a loading state
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}!</h1>
          
          {user.role === 'coach' ? (
            <CoachDashboard />
          ) : (
            <StudentDashboard />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

const CoachDashboard: React.FC = () => {
  // Mock data - in a real app, this would be fetched from your API
  const upcomingAppointments = [
    {
      id: 'appt-1',
      studentName: 'Alex Johnson',
      date: 'May 20, 2023',
      time: '10:00 AM - 11:00 AM',
    },
    {
      id: 'appt-2',
      studentName: 'Taylor Swift',
      date: 'May 21, 2023',
      time: '2:00 PM - 3:00 PM',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="border rounded-md p-4">
                    <p className="font-semibold">{appointment.studentName}</p>
                    <p className="text-sm text-gray-500">{appointment.date}</p>
                    <p className="text-sm text-gray-500">{appointment.time}</p>
                  </div>
                ))}
                <Link to="/appointments">
                  <Button variant="outline" className="w-full">View All Appointments</Button>
                </Link>
              </div>
            ) : (
              <p className="text-gray-500">No upcoming appointments</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-gray-500">Total Sessions</p>
                <p className="font-semibold">12</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-500">Hours Coached</p>
                <p className="font-semibold">16</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-500">Earnings</p>
                <p className="font-semibold">$960.00</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link to="/calendar">
                <Button variant="outline" className="w-full justify-start">
                  Manage Schedule
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline" className="w-full justify-start">
                  Edit Profile
                </Button>
              </Link>
              <Link to="/appointments">
                <Button variant="outline" className="w-full justify-start">
                  View Appointments
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <CoachCalendar />
    </div>
  );
};

const StudentDashboard: React.FC = () => {
  // Mock data - in a real app, this would be fetched from your API
  const upcomingAppointments = [
    {
      id: 'appt-1',
      coachName: 'Dr. Jane Smith',
      date: 'May 20, 2023',
      time: '10:00 AM - 11:00 AM',
    },
  ];

  const recommendedCoaches = [
    {
      id: 'coach-1',
      name: 'Dr. Jane Smith',
      expertise: ['Mathematics', 'Statistics'],
      hourlyRate: 60,
      rating: 4.9,
    },
    {
      id: 'coach-2',
      name: 'Prof. Robert Chen',
      expertise: ['Physics', 'Engineering'],
      hourlyRate: 70,
      rating: 4.8,
    },
    {
      id: 'coach-3',
      name: 'Lisa Johnson',
      expertise: ['Biology', 'Chemistry'],
      hourlyRate: 55,
      rating: 4.7,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="border rounded-md p-4">
                    <p className="font-semibold">Session with {appointment.coachName}</p>
                    <p className="text-sm text-gray-500">{appointment.date}</p>
                    <p className="text-sm text-gray-500">{appointment.time}</p>
                  </div>
                ))}
                <Link to="/appointments">
                  <Button variant="outline" className="w-full">View All Appointments</Button>
                </Link>
              </div>
            ) : (
              <p className="text-gray-500">No upcoming appointments</p>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recommended Coaches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedCoaches.map((coach) => (
                <div key={coach.id} className="border rounded-md p-4">
                  <p className="font-semibold">{coach.name}</p>
                  <div className="flex items-center text-sm mt-1 mb-2">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1">{coach.rating}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {coach.expertise.map((skill, index) => (
                      <span 
                        key={index} 
                        className="bg-brand-teal/10 text-brand-teal px-2 py-0.5 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mb-3">${coach.hourlyRate}/hr</p>
                  <Link to={`/book/${coach.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Book Session
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Find & Book a Coach</h2>
        <BookAppointment />
      </div>
    </div>
  );
};

export default Dashboard;
