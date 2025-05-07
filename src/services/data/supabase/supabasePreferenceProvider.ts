
import { supabase } from '@/integrations/supabase/client';
import { PreferenceProvider, SitePreference } from '@/types/preferences';

export const supabasePreferenceProvider: PreferenceProvider = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('site_preferences')
      .select('*');
      
    if (error) {
      console.error('Error fetching preferences:', error);
      throw error;
    }
    
    return data.map((item) => ({
      id: item.id,
      key: item.key,
      value: item.value,
      description: item.description,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  },
  
  getByKey: async (key: string) => {
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
    
    return {
      id: data.id,
      key: data.key,
      value: data.value,
      description: data.description,
      createdAt: data.created_at,
      updatedAt: data.updated_at
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
