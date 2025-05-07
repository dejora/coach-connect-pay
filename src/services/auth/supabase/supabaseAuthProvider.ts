
import { AuthProvider } from '../types';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';

class SupabaseAuthProvider implements AuthProvider {
  private user: User | null = null;
  private loading: boolean = true;
  private subscription: { unsubscribe: () => void } | null = null;

  constructor() {
    // Initialize the subscription in the constructor
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
            
            this.user = userData;
          } catch (error) {
            console.error('Error fetching user profile:', error);
            this.user = null;
          } finally {
            this.loading = false;
          }
        } else {
          this.user = null;
          this.loading = false;
        }
      }
    );
    
    this.subscription = subscription;
  }

  async init(): Promise<void> {
    this.loading = true;
    
    // Check for an existing session
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
        
        this.user = userData;
      } catch (error) {
        console.error('Error fetching initial user profile:', error);
        this.user = null;
      }
    }
    
    this.loading = false;
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // User will be set by the onAuthStateChange listener
      // Just wait a moment to ensure it has time to process
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!this.user) {
        throw new Error('Failed to retrieve user data after login');
      }
      
      return this.user;
      
    } finally {
      this.loading = false;
    }
  }

  async signup(email: string, password: string, name: string, role: 'coach' | 'student' | 'admin'): Promise<User> {
    this.loading = true;
    
    try {
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
      
      // For signup, we may not have immediate access to the user if email confirmation is required
      if (data.user) {
        // Create a temporary user object based on signup data
        const newUser: User = {
          id: data.user.id,
          email: data.user.email || email,
          name: name,
          role: role,
        };
        
        return newUser;
      }
      
      throw new Error('User signup requires email verification');
      
    } finally {
      this.loading = false;
    }
  }

  async logout(): Promise<void> {
    this.loading = true;
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // User will be set to null by the onAuthStateChange listener
    } finally {
      this.loading = false;
    }
  }

  // Clean up subscription when no longer needed
  cleanup() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

export const supabaseAuthProvider = new SupabaseAuthProvider();
