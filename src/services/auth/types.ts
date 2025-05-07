
import { User } from '@/types';

export interface AuthProvider {
  init: () => Promise<void>;
  login: (email: string, password: string, role: 'coach' | 'student' | 'admin') => Promise<User>;
  signup: (email: string, password: string, name: string, role: 'coach' | 'student' | 'admin') => Promise<User>;
  logout: () => Promise<void>;
  getCurrentUser: () => User | null;
  isAuthenticated: () => boolean;
  isLoading: () => boolean;
}
