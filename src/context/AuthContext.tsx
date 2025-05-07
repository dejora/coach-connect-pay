
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '@/types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useData } from '@/services/data/DataContext';
import { getAuthProvider } from '@/services/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const { dataSource } = useData();
  
  // Get the appropriate auth provider based on the data source
  const authProvider = getAuthProvider(dataSource);

  // Initialize auth based on data source
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await authProvider.init();
      setUser(authProvider.getCurrentUser());
      setIsLoading(false);
    };
    
    initAuth();
    
    // This is a cleanup function that will be executed when the component unmounts
    // or when the dataSource changes
    return () => {
      if ('cleanup' in authProvider) {
        // TypeScript doesn't know about cleanup, so we need to check it exists
        (authProvider as any).cleanup?.();
      }
    };
  }, [dataSource]);

  const login = async (email: string, password: string, role: 'coach' | 'student' | 'admin'): Promise<void> => {
    try {
      setIsLoading(true);
      const loggedInUser = await authProvider.login(email, password, role);
      setUser(loggedInUser);
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

  const signup = async (email: string, password: string, name: string, role: 'coach' | 'student' | 'admin'): Promise<void> => {
    try {
      setIsLoading(true);
      const newUser = await authProvider.signup(email, password, name, role);
      setUser(newUser);
      
      if (dataSource === 'supabase') {
        toast.success(t('auth.signupSuccess'), {
          description: t('auth.checkEmail')
        });
      } else {
        toast.success(t('auth.signupSuccess'));
      }
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
      await authProvider.logout();
      setUser(null);
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
