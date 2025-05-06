
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User, Coach, Student } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  // Initialize auth
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      // First set up the auth state change listener
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
  }, []);

  const login = async (email: string, password: string, role: 'coach' | 'student'): Promise<void> => {
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

  const signup = async (email: string, password: string, name: string, role: 'coach' | 'student'): Promise<void> => {
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

  const logout = async (): Promise<void> => {
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
