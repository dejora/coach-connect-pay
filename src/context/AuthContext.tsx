
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User, Coach, Student } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useData } from '@/services/data/DataContext';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const { dataSource } = useData();
  
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
    }
  ];

  // Initialize auth based on data source
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      // If using mock data, don't do anything on initial load
      if (dataSource === 'mock') {
        setIsLoading(false);
        return;
      }
      
      // First set up the auth state change listener for Supabase
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session && session.user) {
            try {
              // Get user profile data from the profiles table
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
                
              if (profileError) throw profileError;
              
              const userData: User = {
                id: session.user.id,
                email: profileData.email,
                name: profileData.name || '',
                role: profileData.role,
                profileImage: profileData.profile_image,
              };
              
              setUser(userData);
            } catch (error) {
              console.error('Error fetching user profile:', error);
              setUser(null);
            } finally {
              setIsLoading(false);
            }
          } else {
            setUser(null);
            setIsLoading(false);
          }
        }
      );
      
      // Then check for an existing session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session && session.user) {
        try {
          // Get user profile data from the profiles table
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) throw profileError;
          
          const userData: User = {
            id: session.user.id,
            email: profileData.email,
            name: profileData.name || '',
            role: profileData.role,
            profileImage: profileData.profile_image,
          };
          
          setUser(userData);
        } catch (error) {
          console.error('Error fetching initial user profile:', error);
          setUser(null);
        }
      }
      
      setIsLoading(false);
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initAuth();
  }, [dataSource]);

  const mockLogin = async (email: string, password: string, role: 'coach' | 'student'): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simple mock authentication
      const mockUser = mockUsers.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && u.role === role
      );
      
      if (mockUser) {
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setUser(mockUser);
        toast.success(t('auth.loginSuccess'));
        return;
      }
      
      throw new Error('Invalid login credentials');
    } catch (error: any) {
      console.error('Mock login error:', error);
      toast.error(t('auth.loginError'), {
        description: error.message
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, role: 'coach' | 'student'): Promise<void> => {
    // Use mock login if data source is set to mock
    if (dataSource === 'mock') {
      return mockLogin(email, password, role);
    }
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast.success(t('auth.loginSuccess'));
      
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(t('auth.loginError'), {
        description: error.message
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const mockSignup = async (email: string, password: string, name: string, role: 'coach' | 'student'): Promise<void> => {
    setIsLoading(true);
    
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
      
      // "Register" and log in the user
      setUser(newUser);
      
      toast.success(t('auth.signupSuccess'));
      
    } catch (error: any) {
      console.error('Mock signup error:', error);
      toast.error(t('auth.signupError'), {
        description: error.message
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, role: 'coach' | 'student'): Promise<void> => {
    // Use mock signup if data source is set to mock
    if (dataSource === 'mock') {
      return mockSignup(email, password, name, role);
    }
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });
      
      if (error) throw error;
      
      toast.success(t('auth.signupSuccess'), {
        description: t('auth.checkEmail')
      });
      
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(t('auth.signupError'), {
        description: error.message
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const mockLogout = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(null);
      toast.success(t('auth.logoutSuccess'));
    } catch (error: any) {
      console.error('Mock logout error:', error);
      toast.error(t('auth.logoutError'), {
        description: error.message
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    // Use mock logout if data source is set to mock
    if (dataSource === 'mock') {
      return mockLogout();
    }
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast.success(t('auth.logoutSuccess'));
      
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(t('auth.logoutError'), {
        description: error.message
      });
      throw error;
    } finally {
      setIsLoading(false);
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
