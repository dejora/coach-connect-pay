
import { AppointmentProvider } from '../types';
import { Appointment } from '@/types';

// Mock data
let mockAppointments: Appointment[] = [
  {
    id: 'appt-1',
    coachId: 'coach-1',
    studentId: 'student-1',
    timeSlotId: 'slot-2',
    startTime: '2025-05-10T11:00:00Z',
    endTime: '2025-05-10T12:00:00Z',
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentId: 'payment-123',
    notes: 'Math tutoring session',
    createdAt: '2025-05-01T10:00:00Z'
  },
  {
    id: 'appt-2',
    coachId: 'coach-1',
    studentId: 'student-2',
    timeSlotId: 'slot-5',
    startTime: '2025-05-12T14:00:00Z',
    endTime: '2025-05-12T15:00:00Z',
    status: 'pending',
    paymentStatus: 'pending',
    notes: 'Physics exam preparation',
    createdAt: '2025-05-02T11:00:00Z'
  }
];

export const mockAppointmentProvider: AppointmentProvider = {
  getAppointmentsByCoach: async (coachId: string) => {
    return mockAppointments.filter(appointment => appointment.coachId === coachId);
  },
  
  getAppointmentsByStudent: async (studentId: string) => {
    return mockAppointments.filter(appointment => appointment.studentId === studentId);
  },
  
  getAppointmentById: async (id: string) => {
    const appointment = mockAppointments.find(appointment => appointment.id === id);
    return appointment || null;
  },
  
  createAppointment: async (appointment: Omit<Appointment, 'id' | 'createdAt'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: `appt-${mockAppointments.length + 1}`,
      createdAt: new Date().toISOString()
    };
    mockAppointments.push(newAppointment);
    return newAppointment;
  },
  
  updateAppointmentStatus: async (id: string, status: Appointment['status']) => {
    const appointmentIndex = mockAppointments.findIndex(a => a.id === id);
    if (appointmentIndex >= 0) {
      mockAppointments[appointmentIndex] = {
        ...mockAppointments[appointmentIndex],
        status
      };
      return mockAppointments[appointmentIndex];
    }
    throw new Error(`Appointment with id ${id} not found`);
  },
  
  updatePaymentStatus: async (id: string, paymentStatus: Appointment['paymentStatus'], paymentId?: string) => {
    const appointmentIndex = mockAppointments.findIndex(a => a.id === id);
    if (appointmentIndex >= 0) {
      mockAppointments[appointmentIndex] = {
        ...mockAppointments[appointmentIndex],
        paymentStatus,
        paymentId: paymentId || mockAppointments[appointmentIndex].paymentId
      };
      return mockAppointments[appointmentIndex];
    }
    throw new Error(`Appointment with id ${id} not found`);
  }
};
