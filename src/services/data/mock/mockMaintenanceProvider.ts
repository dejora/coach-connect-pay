import { Maintenance } from '@/types';

export const MockMaintenanceProvider: Maintenancerovider = {
  async init() {
    // Mock initialization logic
    console.log('Initializing Mock Maintenance Provider');
  },

  async getMaintenanceStatus(): Promise<boolean> {
    // Simulate maintenance mode detection
    return true; // Change to true to test maintenance page
  }
};