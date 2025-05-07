
import { DataProvider } from '../types';
import { mockTimeSlotProvider } from './mockTimeSlotProvider';
import { mockAppointmentProvider } from './mockAppointmentProvider';
import { mockUserProvider } from './mockUserProvider';
import { mockPreferenceProvider } from './mockPreferenceProvider';

export const mockDataProvider: DataProvider = {
  timeSlots: mockTimeSlotProvider,
  appointments: mockAppointmentProvider,
  users: mockUserProvider,
  preferences: mockPreferenceProvider,
  isConnected: async () => true
};
