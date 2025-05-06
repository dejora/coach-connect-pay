
import { AppointmentProvider } from '../types';
import { Appointment } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const supabaseAppointmentProvider: AppointmentProvider = {
  getAppointmentsByCoach: async (coachId: string) => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('coach_id', coachId);
      
    if (error) {
      console.error('Error fetching coach appointments:', error);
      throw error;
    }
    
    // Convert from snake_case DB fields to camelCase TypeScript fields
    return data.map(appointment => ({
      id: appointment.id,
      coachId: appointment.coach_id,
      studentId: appointment.student_id,
      timeSlotId: appointment.time_slot_id,
      startTime: appointment.start_time,
      endTime: appointment.end_time,
      status: appointment.status,
      paymentStatus: appointment.payment_status,
      paymentId: appointment.payment_id,
      notes: appointment.notes,
      createdAt: appointment.created_at
    }));
  },
  
  getAppointmentsByStudent: async (studentId: string) => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('student_id', studentId);
      
    if (error) {
      console.error('Error fetching student appointments:', error);
      throw error;
    }
    
    // Convert to camelCase
    return data.map(appointment => ({
      id: appointment.id,
      coachId: appointment.coach_id,
      studentId: appointment.student_id,
      timeSlotId: appointment.time_slot_id,
      startTime: appointment.start_time,
      endTime: appointment.end_time,
      status: appointment.status,
      paymentStatus: appointment.payment_status,
      paymentId: appointment.payment_id,
      notes: appointment.notes,
      createdAt: appointment.created_at
    }));
  },
  
  getAppointmentById: async (id: string) => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
    
    if (!data) return null;
    
    // Convert to camelCase
    return {
      id: data.id,
      coachId: data.coach_id,
      studentId: data.student_id,
      timeSlotId: data.time_slot_id,
      startTime: data.start_time,
      endTime: data.end_time,
      status: data.status,
      paymentStatus: data.payment_status,
      paymentId: data.payment_id,
      notes: data.notes,
      createdAt: data.created_at
    };
  },
  
  createAppointment: async (appointment: Omit<Appointment, 'id' | 'createdAt'>) => {
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        coach_id: appointment.coachId,
        student_id: appointment.studentId,
        time_slot_id: appointment.timeSlotId,
        start_time: appointment.startTime,
        end_time: appointment.endTime,
        status: appointment.status,
        payment_status: appointment.paymentStatus,
        payment_id: appointment.paymentId,
        notes: appointment.notes
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
    
    // Convert to camelCase
    return {
      id: data.id,
      coachId: data.coach_id,
      studentId: data.student_id,
      timeSlotId: data.time_slot_id,
      startTime: data.start_time,
      endTime: data.end_time,
      status: data.status,
      paymentStatus: data.payment_status,
      paymentId: data.payment_id,
      notes: data.notes,
      createdAt: data.created_at
    };
  },
  
  updateAppointmentStatus: async (id: string, status: Appointment['status']) => {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
    
    // Convert to camelCase
    return {
      id: data.id,
      coachId: data.coach_id,
      studentId: data.student_id,
      timeSlotId: data.time_slot_id,
      startTime: data.start_time,
      endTime: data.end_time,
      status: data.status,
      paymentStatus: data.payment_status,
      paymentId: data.payment_id,
      notes: data.notes,
      createdAt: data.created_at
    };
  },
  
  updatePaymentStatus: async (id: string, paymentStatus: Appointment['paymentStatus'], paymentId?: string) => {
    const updateData: any = { payment_status: paymentStatus };
    if (paymentId) {
      updateData.payment_id = paymentId;
    }
    
    const { data, error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
    
    // Convert to camelCase
    return {
      id: data.id,
      coachId: data.coach_id,
      studentId: data.student_id,
      timeSlotId: data.time_slot_id,
      startTime: data.start_time,
      endTime: data.end_time,
      status: data.status,
      paymentStatus: data.payment_status,
      paymentId: data.payment_id,
      notes: data.notes,
      createdAt: data.created_at
    };
  }
};
