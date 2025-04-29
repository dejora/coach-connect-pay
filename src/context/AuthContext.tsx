
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '@/types';

// This is a mock implementation. In a real app, you'd integrate with Supabase Auth
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage (mock auth persistence)
    const storedUser = localStorage.getItem('coachconnect-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'coach' | 'student'): Promise<void> => {
    try {
      setIsLoading(true);
      // Mock login - in a real app, this would call Supabase auth.signIn
      
      // Mock successful login with fake user data
      const fakeUser: User = {
        id: `user-${Math.random().toString(36).substr(2, 9)}`,
        email,
        name: email.split('@')[0],
        role,
      };
      
      setUser(fakeUser);
      localStorage.setItem('coachconnect-user', JSON.stringify(fakeUser));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, role: 'coach' | 'student'): Promise<void> => {
    try {
      setIsLoading(true);
      // Mock signup - in a real app, this would call Supabase auth.signUp
      
      // Mock successful signup with fake user data
      const fakeUser: User = {
        id: `user-${Math.random().toString(36).substr(2, 9)}`,
        email,
        name,
        role,
      };
      
      setUser(fakeUser);
      localStorage.setItem('coachconnect-user', JSON.stringify(fakeUser));
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Mock logout - in a real app, this would call Supabase auth.signOut
      setUser(null);
      localStorage.removeItem('coachconnect-user');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
