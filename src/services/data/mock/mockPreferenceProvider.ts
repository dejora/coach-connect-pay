
import { PreferenceProvider, SitePreference } from '@/types/preferences';

// Mock preferences data
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
    return [...mockPreferences];
  },
  
  getByKey: async (key: string) => {
    const preference = mockPreferences.find(p => p.key === key);
    return preference?.value;
  },
  
  update: async (key: string, value: any) => {
    const index = mockPreferences.findIndex(p => p.key === key);
    if (index >= 0) {
      mockPreferences[index].value = value;
      mockPreferences[index].updatedAt = new Date().toISOString();
      return { ...mockPreferences[index] };
    }
    
    // If preference doesn't exist, create it
    const newPreference: SitePreference = {
      id: `${mockPreferences.length + 1}`,
      key,
      value,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockPreferences.push(newPreference);
    return newPreference;
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
