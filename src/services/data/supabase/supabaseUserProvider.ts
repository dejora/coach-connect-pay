
import { UserProvider } from '../types';
import { User, Coach, Student } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const supabaseUserProvider: UserProvider = {
  getUserById: async (id: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      email: data.email,
      name: data.name || '',
      role: data.role,
      profileImage: data.profile_image,
      isActive: data.is_active
    };
  },
  
  getCoachById: async (id: string) => {
    // First try to get public coach information (no email)
    const { data: publicCoaches, error: publicError } = await supabase.rpc('get_public_coach_profiles');
    
    if (!publicError && publicCoaches) {
      const publicCoach = publicCoaches.find((coach: any) => coach.id === id);
      if (publicCoach) {
        return {
          id: publicCoach.id,
          email: '', // No email in public view
          name: publicCoach.name || '',
          role: 'coach' as const,
          profileImage: publicCoach.profile_image,
          bio: publicCoach.bio,
          hourlyRate: publicCoach.hourly_rate || 0,
          expertise: publicCoach.expertise || [],
          rating: publicCoach.rating,
          isActive: publicCoach.is_active
        };
      }
    }
    
    // If not found in public coaches, try direct query (works only for own profile due to RLS)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .eq('role', 'coach')
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching coach:', error);
      throw error;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      email: data.email,
      name: data.name || '',
      role: 'coach' as const,
      profileImage: data.profile_image,
      bio: data.bio,
      hourlyRate: data.hourly_rate || 0,
      expertise: data.expertise || [],
      rating: data.rating,
      isActive: data.is_active
    };
  },
  
  getStudentById: async (id: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .eq('role', 'student')
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching student:', error);
      throw error;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      email: data.email,
      name: data.name || '',
      role: 'student',
      profileImage: data.profile_image,
      isActive: data.is_active
    };
  },
  
  updateUser: async (userData: Partial<User> & { id: string }) => {
    // Convert camelCase to snake_case for Supabase
    const updateData: any = {};
    
    if (userData.name !== undefined) updateData.name = userData.name;
    if (userData.email !== undefined) updateData.email = userData.email;
    if (userData.profileImage !== undefined) updateData.profile_image = userData.profileImage;
    if (userData.isActive !== undefined) updateData.is_active = userData.isActive;
    
    // Handle coach-specific fields
    if (userData.role === 'coach') {
      const coachData = userData as Partial<Coach> & { id: string };
      if (coachData.bio !== undefined) updateData.bio = coachData.bio;
      if (coachData.hourlyRate !== undefined) updateData.hourly_rate = coachData.hourlyRate;
      if (coachData.expertise !== undefined) updateData.expertise = coachData.expertise;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userData.id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating user:', error);
      throw error;
    }
    
    // Convert back to camelCase
    return {
      id: data.id,
      email: data.email,
      name: data.name || '',
      role: data.role,
      profileImage: data.profile_image,
      isActive: data.is_active
    };
  },
  
  getCoaches: async (limit?: number, activeOnly: boolean = false) => {
    // Use the secure function that excludes email addresses for public coach listings
    const { data, error } = await supabase.rpc('get_public_coach_profiles');
      
    if (error) {
      console.error('Error fetching coaches:', error);
      throw error;
    }
    
    let coaches = data || [];
    
    // Apply client-side filtering since the function already filters by active coaches
    if (!activeOnly) {
      // If not filtering by active only, we need to get inactive coaches too
      // For now, the function only returns active coaches, so we'll keep this behavior
      // This maintains security while the function only exposes active coaches
    }
    
    if (limit) {
      coaches = coaches.slice(0, limit);
    }
    
    // Convert to camelCase and exclude email (already excluded by function)
    return coaches.map(coach => ({
      id: coach.id,
      email: '', // Email is not available in public listings for security
      name: coach.name || '',
      role: 'coach' as const,
      profileImage: coach.profile_image,
      bio: coach.bio,
      hourlyRate: coach.hourly_rate || 0,
      expertise: coach.expertise || [],
      rating: coach.rating,
      isActive: coach.is_active
    }));
  },
  
  toggleCoachActive: async (id: string, isActive: boolean) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_active: isActive })
      .eq('id', id)
      .eq('role', 'coach')
      .select()
      .single();
      
    if (error) {
      console.error('Error updating coach active status:', error);
      throw error;
    }
    
    return {
      id: data.id,
      email: data.email,
      name: data.name || '',
      role: 'coach',
      profileImage: data.profile_image,
      bio: data.bio,
      hourlyRate: data.hourly_rate || 0,
      expertise: data.expertise || [],
      rating: data.rating,
      isActive: data.is_active
    };
  }
};
