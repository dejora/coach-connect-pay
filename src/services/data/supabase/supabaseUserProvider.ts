
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
      role: 'coach',
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
    let query = supabase
      .from('profiles')
      .select('*')
      .eq('role', 'coach');
      
    if (activeOnly) {
      query = query.eq('is_active', true);
    }
      
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
      
    if (error) {
      console.error('Error fetching coaches:', error);
      throw error;
    }
    
    // Convert to camelCase
    return data.map(coach => ({
      id: coach.id,
      email: coach.email,
      name: coach.name || '',
      role: 'coach',
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
