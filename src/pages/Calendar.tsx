
import React from 'react';
import Layout from '@/components/Layout';
import CoachCalendar from '@/components/CoachDashboard/Calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CalendarPage: React.FC = () => {
  return (
    <Layout>
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>My Coaching Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <CoachCalendar />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CalendarPage;
