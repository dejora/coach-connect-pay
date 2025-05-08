import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import MaintenanceMode from "@/components/MaintenanceMode";
import PrivateRoute from "@/components/PrivateRoute";

// Import i18n configuration
import '@/i18n';

// Lazy load pages
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Appointments = lazy(() => import("./pages/Appointments"));
const Appointment = lazy(() => import("./pages/Appointment"));
const BookSession = lazy(() => import("./pages/BookSession"));
const Calendar = lazy(() => import("./pages/Calendar"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentCanceled = lazy(() => import("./pages/PaymentCanceled"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const Coaches = lazy(() => import("./pages/Coaches"));
const CoachProfile = lazy(() => import("./pages/CoachProfile"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <MaintenanceMode>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/appointments" element={<PrivateRoute><Appointments /></PrivateRoute>} />
          <Route path="/appointment/:id" element={<PrivateRoute><Appointment /></PrivateRoute>} />
          <Route path="/book/:coachId" element={<PrivateRoute><BookSession /></PrivateRoute>} />
          <Route path="/calendar" element={<PrivateRoute><Calendar /></PrivateRoute>} />
          <Route path="/payment-success" element={<PrivateRoute><PaymentSuccess /></PrivateRoute>} />
          <Route path="/payment-canceled" element={<PrivateRoute><PaymentCanceled /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/coaches" element={<Coaches />} />
          <Route path="/coach/:coachId" element={<CoachProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </MaintenanceMode>
  </TooltipProvider>
);

export default App;
