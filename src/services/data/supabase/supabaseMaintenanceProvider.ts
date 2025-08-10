import { Maintenance } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const SupabaseMaintenanceProvider: Maintenance = {
  async init() {
    // Any Supabase-specific initialization
  },

  async getMaintenanceStatus(): Promise<boolean> {
    // Maintenance mode preference should be read from preferences provider or a dedicated table.
    // For now, default to false to avoid type errors until backend storage is set up.
    return false;
  }
};