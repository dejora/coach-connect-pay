
import { Appointment, TimeSlot, Coach, Student, User } from '@/types';
import { PreferenceProvider } from '@/types/preferences';

// Define interfaces for our data providers
export interface TimeSlotProvider {
  getTimeSlotsByCoach: (coachId: string, startDate: string, endDate: string) => Promise<TimeSlot[]>;
  createTimeSlot: (timeSlot: Omit<TimeSlot, 'id'>) => Promise<TimeSlot>;
  deleteTimeSlot: (id: string) => Promise<void>;
  updateTimeSlot: (timeSlot: TimeSlot) => Promise<TimeSlot>;
}

export interface AppointmentProvider {
  getAppointmentsByCoach: (coachId: string) => Promise<Appointment[]>;
  getAppointmentsByStudent: (studentId: string) => Promise<Appointment[]>;
  getAppointmentById: (id: string) => Promise<Appointment | null>;
  createAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => Promise<Appointment>;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => Promise<Appointment>;
  updatePaymentStatus: (id: string, paymentStatus: Appointment['paymentStatus'], paymentId?: string) => Promise<Appointment>;
}

export interface UserProvider {
  getUserById: (id: string) => Promise<User | null>;
  getCoachById: (id: string) => Promise<Coach | null>;
  getStudentById: (id: string) => Promise<Student | null>;
  updateUser: (user: Partial<User> & { id: string }) => Promise<User>;
  getCoaches: (limit?: number) => Promise<Coach[]>;
}

export interface DataProvider {
  timeSlots: TimeSlotProvider;
  appointments: AppointmentProvider;
  users: UserProvider;
  preferences: PreferenceProvider;
  isConnected: () => Promise<boolean>;
}
