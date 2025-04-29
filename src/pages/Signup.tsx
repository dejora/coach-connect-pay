
import React from 'react';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import AuthForm from '@/components/Authentication/AuthForm';
import { useAuth } from '@/context/AuthContext';

const Signup: React.FC = () => {
  const { user } = useAuth();

  // If a user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-6">
          <AuthForm type="signup" />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Signup;
