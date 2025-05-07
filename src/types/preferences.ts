
export interface SitePreference {
  id: string;
  key: string;
  value: any;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PreferenceProvider {
  getAll: () => Promise<SitePreference[]>;
  getByKey: (key: string) => Promise<any>;
  update: (key: string, value: any) => Promise<SitePreference>;
  isMaintenanceMode: () => Promise<boolean>;
  getSiteUrl: () => Promise<string>;
  getDefaultLanguage: () => Promise<string>;
}
