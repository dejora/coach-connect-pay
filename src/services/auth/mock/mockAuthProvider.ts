
import { AuthProvider } from '../types';
import { User } from '@/types';
import { toast } from 'sonner';

// Local storage key for storing mock user data
const MOCK_USER_KEY = 'coachconnect-mock-user';

// Mock user data for development
const mockUsers = [
  {
    id: 'coach-1',
    email: 'coach@example.com',
    name: 'Jane Smith',
    role: 'coach' as const,
    profileImage: '/assets/coach1.jpg'
  },
  {
    id: 'student-1',
    email: 'student@example.com',
    name: 'Alice Johnson',
    role: 'student' as const
  },
  {
    id: 'admin-1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin' as const,
    profileImage: '/assets/admin-avatar.jpg'
  }
];

class MockAuthProvider implements AuthProvider {
  private user: User | null = null;
  private loading: boolean = true;

  async init(): Promise<void> {
    this.loading = true;
    
    try {
      const storedUser = localStorage.getItem(MOCK_USER_KEY);
      if (storedUser) {
        this.user = JSON.parse(storedUser);
      }
    } catch (error) {
      console.error('Error parsing stored user:', error);
      localStorage.removeItem(MOCK_USER_KEY);
      this.user = null;
    } finally {
      this.loading = false;
    }
  }

  getCurrentUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return this.user !== null;
  }

  isLoading(): boolean {
    return this.loading;
  }

  async login(email: string, password: string, role: 'coach' | 'student' | 'admin'): Promise<User> {
    this.loading = true;
    
    try {
      // Simple mock authentication
      const mockUser = mockUsers.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && u.role === role
      );
      
      if (mockUser) {
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Store the user in localStorage for persistence
        localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
        
        this.user = mockUser;
        return mockUser;
      }
      
      throw new Error('Invalid login credentials');
    } finally {
      this.loading = false;
    }
  }

  async signup(email: string, password: string, name: string, role: 'coach' | 'student' | 'admin'): Promise<User> {
    this.loading = true;
    
    try {
      // Create a new mock user
      const newUser = {
        id: `${role}-${Date.now()}`,
        email,
        name,
        role,
        profileImage: role === 'coach' ? '/assets/coach-placeholder.jpg' : undefined
      };
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Store the user in localStorage for persistence
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(newUser));
      
      // "Register" and log in the user
      this.user = newUser;
      
      return newUser;
    } finally {
      this.loading = false;
    }
  }

  async logout(): Promise<void> {
    this.loading = true;
    
    try {
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove the user from localStorage
      localStorage.removeItem(MOCK_USER_KEY);
      
      this.user = null;
    } finally {
      this.loading = false;
    }
  }
}

export const mockAuthProvider = new MockAuthProvider();
