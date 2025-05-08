import { BaseDataProvider } from '../BaseDataProvider';
import { mockTimeSlotProvider } from './mockTimeSlotProvider';
import { mockAppointmentProvider } from './mockAppointmentProvider';
import { mockUserProvider } from './mockUserProvider';
import { mockPreferenceProvider } from './mockPreferenceProvider';

class MockDataProvider extends BaseDataProvider {
  timeSlots = mockTimeSlotProvider;
  appointments = mockAppointmentProvider;
  users = mockUserProvider;
  preferences = mockPreferenceProvider;

  async initialize(): Promise<void> {
    // Pas besoin de créer des tables pour le mock provider
    await this.seedData();
  }

  async isConnected(): Promise<boolean> {
    return true;
  }

  async cleanup(): Promise<void> {
    // Nettoyer les données en mémoire si nécessaire
  }

  protected async seedData(): Promise<void> {
    // Initialiser les données mock si ce n'est pas déjà fait
    if (!this.users.getUserById('1')) {
      // Ajouter des données mock initiales
      // Cette logique peut être déplacée dans un fichier séparé
      await this.users.updateUser({
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin'
      });
      // Ajouter d'autres données mock initiales...
    }
  }
}

export const mockDataProvider = new MockDataProvider();
