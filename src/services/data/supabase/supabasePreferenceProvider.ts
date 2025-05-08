
import { PreferenceProvider } from '@/types/preferences';
import { supabase } from '@/integrations/supabase/client';

// Définir un type pour les préférences de site en base de données
type SitePreferenceRow = {
  id: string;
  key: string;
  value: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
};

export const supabasePreferenceProvider: PreferenceProvider = {
  getPreference: async (key) => {
    try {
      // Utiliser la fonction RPC pour éviter les problèmes de typage avec les tables manquantes
      const { data, error } = await supabase.rpc('get_site_preference', { 
        preference_key: key 
      });

      if (error) {
        console.error('Error fetching preference:', error);
        return null;
      }

      return data || null;
    } catch (error) {
      console.error('Error in getPreference:', error);
      return null;
    }
  },

  getAllPreferences: async () => {
    try {
      // Utiliser la fonction RPC pour obtenir toutes les préférences
      const { data, error } = await supabase.rpc('get_all_site_preferences');

      if (error) {
        console.error('Error fetching all preferences:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllPreferences:', error);
      return [];
    }
  },

  setPreference: async (key, value, description) => {
    try {
      // Utiliser la fonction RPC pour définir une préférence
      const { data, error } = await supabase.rpc('set_site_preference', {
        preference_key: key,
        preference_value: value,
        preference_description: description || null
      });

      if (error) {
        console.error('Error setting preference:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in setPreference:', error);
      return false;
    }
  }
};
