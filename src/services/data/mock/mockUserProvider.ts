
import { UserProvider } from '../types';
import { User, Coach, Student } from '@/types';
import mockData from './mockData';

export const mockUserProvider: UserProvider = {
  getUserById: async (id: string) => {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const user = mockData.users.find(user => user.id === id);
    return user || null;
  },
  
  getCoachById: async (id: string) => {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const coach = mockData.coaches.find(coach => coach.id === id);
    return coach || null;
  },
  
  getStudentById: async (id: string) => {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const student = mockData.students.find(student => student.id === id);
    return student || null;
  },
  
  updateUser: async (userData: Partial<User> & { id: string }) => {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userIndex = mockData.users.findIndex(user => user.id === userData.id);
    
    if (userIndex === -1) {
      throw new Error(`User with id ${userData.id} not found`);
    }
    
    // Update user in mock data
    mockData.users[userIndex] = {
      ...mockData.users[userIndex],
      ...userData
    };
    
    return mockData.users[userIndex];
  },
  
  getCoaches: async (limit?: number, activeOnly: boolean = false) => {
    // Simuler un délai
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let coaches = mockData.coaches;
    
    if (activeOnly) {
      coaches = coaches.filter(coach => coach.isActive !== false);
    }
    
    if (limit) {
      coaches = coaches.slice(0, limit);
    }
    
    return coaches;
  },
  
  toggleCoachActive: async (id: string, isActive: boolean) => {
    // Simuler un délai
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const coachIndex = mockData.coaches.findIndex(c => c.id === id);
    
    if (coachIndex === -1) {
      throw new Error(`Coach with id ${id} not found`);
    }
    
    // Mettre à jour le coach dans les données mock
    mockData.coaches[coachIndex] = {
      ...mockData.coaches[coachIndex],
      isActive
    };
    
    return mockData.coaches[coachIndex];
  }
};
