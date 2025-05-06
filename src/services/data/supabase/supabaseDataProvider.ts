
import { DataProvider } from '../types';
import { supabaseTimeSlotProvider } from './supabaseTimeSlotProvider';
import { supabaseAppointmentProvider } from './supabaseAppointmentProvider';
import { supabaseUserProvider } from './supabaseUserProvider';
import { supabase } from '@/integrations/supabase/client';

export const supabaseDataProvider: DataProvider = {
  timeSlots: supabaseTimeSlotProvider,
  appointments: supabaseAppointmentProvider,
  users: supabaseUserProvider,
  isConnected: async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      return !error;
    } catch (err) {
      console.error('Error checking Supabase connection:', err);
      return false;
    }
  }
};
