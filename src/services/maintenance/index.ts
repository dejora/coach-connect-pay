import { DataSource } from '@/types';
import { DataProvider } from '@/services/data/types';
import { mockDataProvider } from '@/services/data/mock/mockDataProvider';
import { supabaseDataProvider } from '@/services/data/supabase/supabaseDataProvider';

export interface MaintenanceStatus {
  isMaintenanceMode: boolean;
  message?: string;
  estimatedCompletionTime?: string;
}

export interface MaintenanceProvider {
  init: () => Promise<void>;
  getMaintenanceStatus: () => Promise<MaintenanceStatus>;
}

const mapProvider = (dataSource: DataSource): DataProvider => {
  return dataSource === 'supabase' ? supabaseDataProvider : mockDataProvider;
};

export const getMaintenanceProvider = (dataSource: DataSource): MaintenanceProvider => {
  const dataProvider = mapProvider(dataSource);
  
  return {
    async init() {
      await dataProvider.initialize();
    },
    
    async getMaintenanceStatus() {
      const isMaintenanceMode = await dataProvider.preferences.isMaintenanceMode();
      return {
        isMaintenanceMode,
        message: '',
        estimatedCompletionTime: ''
      };
    }
  };
};