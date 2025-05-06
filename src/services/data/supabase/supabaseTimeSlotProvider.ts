
import { TimeSlotProvider } from '../types';
import { TimeSlot } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const supabaseTimeSlotProvider: TimeSlotProvider = {
  getTimeSlotsByCoach: async (coachId: string, startDate: string, endDate: string) => {
    const { data, error } = await supabase
      .from('coach_time_slots')
      .select('*')
      .eq('coach_id', coachId)
      .gte('start_time', startDate)
      .lt('start_time', endDate);
      
    if (error) {
      console.error('Error fetching time slots:', error);
      throw error;
    }
    
    // Convert from snake_case DB fields to camelCase TypeScript fields
    return data.map(slot => ({
      id: slot.id,
      coachId: slot.coach_id,
      startTime: slot.start_time,
      endTime: slot.end_time,
      isBooked: slot.is_booked
    }));
  },
  
  createTimeSlot: async (timeSlot: Omit<TimeSlot, 'id'>) => {
    // Convert from camelCase TypeScript fields to snake_case DB fields
    const { data, error } = await supabase
      .from('coach_time_slots')
      .insert({
        coach_id: timeSlot.coachId,
        start_time: timeSlot.startTime,
        end_time: timeSlot.endTime,
        is_booked: timeSlot.isBooked
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating time slot:', error);
      throw error;
    }
    
    // Convert back to camelCase
    return {
      id: data.id,
      coachId: data.coach_id,
      startTime: data.start_time,
      endTime: data.end_time,
      isBooked: data.is_booked
    };
  },
  
  deleteTimeSlot: async (id: string) => {
    const { error } = await supabase
      .from('coach_time_slots')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting time slot:', error);
      throw error;
    }
  },
  
  updateTimeSlot: async (timeSlot: TimeSlot) => {
    const { data, error } = await supabase
      .from('coach_time_slots')
      .update({
        coach_id: timeSlot.coachId,
        start_time: timeSlot.startTime,
        end_time: timeSlot.endTime,
        is_booked: timeSlot.isBooked
      })
      .eq('id', timeSlot.id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating time slot:', error);
      throw error;
    }
    
    // Convert to camelCase
    return {
      id: data.id,
      coachId: data.coach_id,
      startTime: data.start_time,
      endTime: data.end_time,
      isBooked: data.is_booked
    };
  }
};
