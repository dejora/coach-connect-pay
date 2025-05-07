
import { PreferenceProvider, SitePreference } from '@/types/preferences';

// Données simulées de préférences
const mockPreferences: SitePreference[] = [
  {
    id: '1',
    key: 'maintenance_mode',
    value: false,
    description: 'Enable site maintenance mode',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    key: 'site_url',
    value: 'https://coachconnect.app',
    description: 'Primary URL of the application',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    key: 'default_language',
    value: 'en',
    description: 'Default language for the application',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const mockPreferenceProvider: PreferenceProvider = {
  getAll: async () => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockPreferences];
  },
  
  getByKey: async (key: string) => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 100));
    const preference = mockPreferences.find(p => p.key === key);
    return preference?.value;
  },
  
  update: async (key: string, value: any) => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const preferenceIndex = mockPreferences.findIndex(p => p.key === key);
    if (preferenceIndex === -1) {
      throw new Error(`Preference with key ${key} not found`);
    }
    
    const updatedPreference = {
      ...mockPreferences[preferenceIndex],
      value,
      updatedAt: new Date().toISOString()
    };
    
    mockPreferences[preferenceIndex] = updatedPreference;
    return updatedPreference;
  },
  
  isMaintenanceMode: async () => {
    const value = await mockPreferenceProvider.getByKey('maintenance_mode');
    return value === true;
  },
  
  getSiteUrl: async () => {
    const value = await mockPreferenceProvider.getByKey('site_url');
    return value || 'https://coachconnect.app';
  },
  
  getDefaultLanguage: async () => {
    const value = await mockPreferenceProvider.getByKey('default_language');
    return value || 'en';
  }
};
