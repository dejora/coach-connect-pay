
import { supabase } from '@/integrations/supabase/client';
import { PreferenceProvider, SitePreference } from '@/types/preferences';

export const supabasePreferenceProvider: PreferenceProvider = {
  getAll: async () => {
    try {
      // Using raw SQL call without type parameters
      const { data, error } = await supabase.rpc('get_all_preferences');
      
      if (error) {
        console.error('Error fetching preferences:', error);
        throw error;
      }
      
      // Map from snake_case database fields to camelCase application model
      return (data || []).map((item: any) => ({
        id: item.id,
        key: item.key,
        value: item.value,
        description: item.description,
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
      // Using raw SQL call without type parameters
      const { data, error } = await supabase.rpc('get_preference_by_key', { 
        preference_key: key 
      });
      
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
      // Using raw SQL call without type parameters
      const { data, error } = await supabase.rpc('update_preference', { 
        preference_key: key, 
        preference_value: value 
      });
      
      if (error) {
        console.error(`Error updating preference ${key}:`, error);
        throw error;
      }
      
      if (!data) {
        throw new Error(`No data returned when updating preference ${key}`);
      }
      
      // Map from snake_case to camelCase
      return {
        id: data.id || '',
        key: data.key || '',
        value: data.value,
        description: data.description || '',
        createdAt: data.created_at || new Date().toISOString(),
        updatedAt: data.updated_at || new Date().toISOString()
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
