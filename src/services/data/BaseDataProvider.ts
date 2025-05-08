import { DataProvider, TimeSlotProvider, AppointmentProvider, UserProvider } from './types';
import { PreferenceProvider } from '@/types/preferences';

export abstract class BaseDataProvider implements DataProvider {
  abstract timeSlots: TimeSlotProvider;
  abstract appointments: AppointmentProvider;
  abstract users: UserProvider;
  abstract preferences: PreferenceProvider;
  
  abstract initialize(): Promise<void>;
  abstract isConnected(): Promise<boolean>;
  abstract cleanup(): Promise<void>;

  protected async createTables(): Promise<void> {
    // Cette méthode sera implémentée par les providers qui ont besoin de créer des tables
    return;
  }

  protected async seedData(): Promise<void> {
    // Cette méthode sera implémentée par les providers qui ont besoin de données initiales
    return;
  }

  protected async validateSchema(): Promise<boolean> {
    // Cette méthode sera implémentée par les providers qui ont besoin de valider leur schéma
    return true;
  }
} 