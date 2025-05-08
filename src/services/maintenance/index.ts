import { DataSource } from '@/types';
import { getDataProvider } from '@/services/data';

export interface MaintenanceStatus {
  isMaintenanceMode: boolean;
  message?: string;
  estimatedCompletionTime?: string;
}

export interface MaintenanceProvider {
  init: () => Promise<void>;
  getMaintenanceStatus: () => Promise<MaintenanceStatus>;
}

export const getMaintenanceProvider = (dataSource: DataSource): MaintenanceProvider => {
  const dataProvider = getDataProvider(dataSource);
  
  return {
    async init() {
      await dataProvider.init();
    },
    
    async getMaintenanceStatus() {
      // Cette méthode devrait être implémentée dans chaque data provider
      if ('getMaintenanceStatus' in dataProvider) {
        return (dataProvider as any).getMaintenanceStatus();
      }
      
      // Valeur par défaut si non implémenté
      return {
        isMaintenanceMode: false,
        message: '',
        estimatedCompletionTime: ''
      };
    }
  };
};