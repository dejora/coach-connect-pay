
import { PreferenceProvider, SitePreference } from '@/types/preferences';

// Supabase preferences provider placeholder: until a preferences table/functions are available
// we return sane defaults and persist updates in localStorage to keep the app working.

const STORAGE_KEY = 'supabase-site-preferences';

const load = (): SitePreference[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const now = new Date().toISOString();
  return [
    { id: '1', key: 'maintenance_mode', value: false, description: 'Enable site maintenance mode', createdAt: now, updatedAt: now },
    { id: '2', key: 'site_url', value: 'https://coachconnect.app', description: 'Primary URL of the application', createdAt: now, updatedAt: now },
    { id: '3', key: 'default_language', value: 'en', description: 'Default language for the application', createdAt: now, updatedAt: now },
  ];
};

const save = (prefs: SitePreference[]) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch {}
};

export const supabasePreferenceProvider: PreferenceProvider = {
  async getAll() {
    return load();
  },

  async getByKey(key: string) {
    const prefs = load();
    return prefs.find(p => p.key === key)?.value;
  },

  async update(key: string, value: any) {
    const prefs = load();
    const idx = prefs.findIndex(p => p.key === key);
    const now = new Date().toISOString();
    if (idx >= 0) {
      prefs[idx] = { ...prefs[idx], value, updatedAt: now };
      save(prefs);
      return { ...prefs[idx] };
    }
    const newPref: SitePreference = { id: `${prefs.length + 1}`, key, value, createdAt: now, updatedAt: now };
    prefs.push(newPref);
    save(prefs);
    return newPref;
  },

  async isMaintenanceMode() {
    const val = await this.getByKey('maintenance_mode');
    return val === true;
  },

  async getSiteUrl() {
    return (await this.getByKey('site_url')) || 'https://coachconnect.app';
  },

  async getDefaultLanguage() {
    return (await this.getByKey('default_language')) || 'en';
  }
};
