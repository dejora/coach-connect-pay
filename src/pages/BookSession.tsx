
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import BookAppointment from '@/components/StudentDashboard/BookAppointment';

const BookSession: React.FC = () => {
  const { coachId } = useParams<{ coachId: string }>();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <BookAppointment coachId={coachId} />
      </div>
    </Layout>
  );
};

export default BookSession;
