
import { supabase } from '@/integrations/supabase/client';
import { PreferenceProvider, SitePreference } from '@/types/preferences';

// Define the structure of data returned from database
interface DbSitePreference {
  id: string;
  key: string;
  value: any;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export const supabasePreferenceProvider: PreferenceProvider = {
  getAll: async () => {
    try {
      // Using direct table query instead of RPC for type safety
      const { data, error } = await supabase
        .from('site_preferences')
        .select('*');
      
      if (error) {
        console.error('Error fetching preferences:', error);
        throw error;
      }
      
      // Map from snake_case database fields to camelCase application model
      return (data || []).map((item) => ({
        id: item.id,
        key: item.key,
        value: item.value,
        description: item.description || '',
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
    } catch (error) {
      console.error('Error in getAll:', error);
      return []; // Return empty array in case of error
    }
  },
  
  getByKey: async (key: string) => {
    try {
      // Using direct table query instead of RPC for type safety
      const { data, error } = await supabase
        .from('site_preferences')
        .select('*')
        .eq('key', key)
        .maybeSingle();
      
      if (error) {
        console.error(`Error fetching preference ${key}:`, error);
        throw error;
      }
      
      return data?.value || null;
    } catch (error) {
      console.error(`Error in getByKey(${key}):`, error);
      return null; // Return null in case of error
    }
  },
  
  update: async (key: string, value: any) => {
    try {
      // First check if the preference exists
      const { data: existingData } = await supabase
        .from('site_preferences')
        .select('*')
        .eq('key', key)
        .maybeSingle();
      
      let result;
      
      if (existingData) {
        // Update existing preference
        const { data, error } = await supabase
          .from('site_preferences')
          .update({ value, updated_at: new Date().toISOString() })
          .eq('key', key)
          .select()
          .single();
        
        if (error) {
          console.error(`Error updating preference ${key}:`, error);
          throw error;
        }
        
        result = data;
      } else {
        // Insert new preference
        const { data, error } = await supabase
          .from('site_preferences')
          .insert({ key, value })
          .select()
          .single();
        
        if (error) {
          console.error(`Error creating preference ${key}:`, error);
          throw error;
        }
        
        result = data;
      }
      
      if (!result) {
        throw new Error(`No data returned when updating preference ${key}`);
      }
      
      // Map from snake_case to camelCase
      return {
        id: result.id || '',
        key: result.key || '',
        value: result.value,
        description: result.description || '',
        createdAt: result.created_at || new Date().toISOString(),
        updatedAt: result.updated_at || new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error in update(${key}):`, error);
      throw error;
    }
  },
  
  isMaintenanceMode: async () => {
    try {
      const value = await supabasePreferenceProvider.getByKey('maintenance_mode');
      return value === true;
    } catch (error) {
      console.error('Error checking maintenance mode:', error);
      return false; // Default to not in maintenance mode
    }
  },
  
  getSiteUrl: async () => {
    try {
      const value = await supabasePreferenceProvider.getByKey('site_url');
      return value || 'https://coachconnect.app';
    } catch (error) {
      console.error('Error getting site URL:', error);
      return 'https://coachconnect.app'; // Default site URL
    }
  },
  
  getDefaultLanguage: async () => {
    try {
      const value = await supabasePreferenceProvider.getByKey('default_language');
      return value || 'en';
    } catch (error) {
      console.error('Error getting default language:', error);
      return 'en'; // Default language
    }
  }
};
