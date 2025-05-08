import { Maintenance } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const SupabaseMaintenanceProvider: Maintenance = {
  async init() {
    // Any Supabase-specific initialization
  },

  async getMaintenanceStatus(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('maintenance_mode')
        .single();

      if (error) throw error;

      return data?.maintenance_mode || false;
    } catch (error) {
      console.error('Error fetching maintenance status:', error);
      return false;
    }
  }
};