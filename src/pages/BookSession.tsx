
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import BookAppointment from '@/components/StudentDashboard/BookAppointment';

const BookSession: React.FC = () => {
  const { coachId } = useParams<{ coachId: string }>();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <BookAppointment coachId={coachId} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookSession;
