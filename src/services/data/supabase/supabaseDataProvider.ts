import { BaseDataProvider } from '../BaseDataProvider';
import { supabaseTimeSlotProvider } from './supabaseTimeSlotProvider';
import { supabaseAppointmentProvider } from './supabaseAppointmentProvider';
import { supabaseUserProvider } from './supabaseUserProvider';
import { supabasePreferenceProvider } from './supabasePreferenceProvider';
import { supabase } from '@/integrations/supabase/client';

class SupabaseDataProvider extends BaseDataProvider {
  timeSlots = supabaseTimeSlotProvider;
  appointments = supabaseAppointmentProvider;
  users = supabaseUserProvider;
  preferences = supabasePreferenceProvider;

  async initialize(): Promise<void> {
    // Schema is managed via migrations; nothing to initialize here
  }

  async isConnected(): Promise<boolean> {
    try {
      const { data, error } = await supabase.from('profiles').select('id').limit(1);
      return !error;
    } catch (err) {
      console.error('Error checking Supabase connection:', err);
      return false;
    }
  }

  async cleanup(): Promise<void> {
    // Nettoyer les connexions Supabase si nécessaire
  }

  protected async createTables(): Promise<void> {
    // No-op: Database schema is managed via Supabase migrations
  }

  protected async validateSchema(): Promise<boolean> {
    // Assume schema is valid when using managed migrations
    return true;
  }

  protected async seedData(): Promise<void> {
    // No-op: Seeding should be handled via migrations or admin tools
  }
}

export const supabaseDataProvider = new SupabaseDataProvider();
