
import { DataProvider } from '../types';
import { mockTimeSlotProvider } from './mockTimeSlotProvider';
import { mockAppointmentProvider } from './mockAppointmentProvider';
import { mockUserProvider } from './mockUserProvider';

export const mockDataProvider: DataProvider = {
  timeSlots: mockTimeSlotProvider,
  appointments: mockAppointmentProvider,
  users: mockUserProvider,
  isConnected: async () => true // Mock is always "connected"
};
