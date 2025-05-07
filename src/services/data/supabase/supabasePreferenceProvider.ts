
import { supabase } from '@/integrations/supabase/client';
import { PreferenceProvider, SitePreference } from '@/types/preferences';

// Interface to match the database table structure
interface DbSitePreference {
  id: string;
  key: string;
  value: any;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const supabasePreferenceProvider: PreferenceProvider = {
  getAll: async () => {
    // Using string parameters to avoid type checking issues
    const { data, error } = await supabase
      .from('site_preferences')
      .select('*');
      
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
  },
  
  getByKey: async (key: string) => {
    // Using string parameters to avoid type checking issues
    const { data, error } = await supabase
      .from('site_preferences')
      .select('value')
      .eq('key', key)
      .maybeSingle();
    
    if (error) {
      console.error(`Error fetching preference ${key}:`, error);
      throw error;
    }
    
    return data?.value;
  },
  
  update: async (key: string, value: any) => {
    // First check if the preference exists
    const { data: existing } = await supabase
      .from('site_preferences')
      .select('id')
      .eq('key', key)
      .maybeSingle();
      
    let result;
    
    if (existing) {
      // Update existing preference
      const { data, error } = await supabase
        .from('site_preferences')
        .update({ value })
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
    
    // Map from snake_case to camelCase
    return {
      id: result.id,
      key: result.key,
      value: result.value,
      description: result.description,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    };
  },
  
  isMaintenanceMode: async () => {
    const value = await supabasePreferenceProvider.getByKey('maintenance_mode');
    return value === true;
  },
  
  getSiteUrl: async () => {
    const value = await supabasePreferenceProvider.getByKey('site_url');
    return value || 'https://coachconnect.app';
  },
  
  getDefaultLanguage: async () => {
    const value = await supabasePreferenceProvider.getByKey('default_language');
    return value || 'en';
  }
};
