
import { supabase } from '@/integrations/supabase/client';
import { Appointment } from '@/types';
import { AppointmentProvider } from '../types';

export const supabaseAppointmentProvider: AppointmentProvider = {
  // Renamed to match the interface
  getAppointmentsByCoach: async (coachId: string): Promise<Appointment[]> => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('coach_id', coachId);
      
      if (error) throw error;
      
      // Map snake_case database fields to camelCase application model
      return data.map(appointment => ({
        id: appointment.id,
        coachId: appointment.coach_id,
        studentId: appointment.student_id,
        timeSlotId: appointment.time_slot_id,
        startTime: appointment.start_time,
        endTime: appointment.end_time,
        status: appointment.status as Appointment['status'],
        paymentStatus: appointment.payment_status as Appointment['paymentStatus'],
        paymentId: appointment.payment_id || undefined,
        notes: appointment.notes || '',
        createdAt: appointment.created_at
      }));
    } catch (error) {
      console.error('Error fetching coach appointments:', error);
      throw error;
    }
  },
  
  // Renamed to match the interface
  getAppointmentsByStudent: async (studentId: string): Promise<Appointment[]> => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('student_id', studentId);
      
      if (error) throw error;
      
      // Map snake_case database fields to camelCase application model
      return data.map(appointment => ({
        id: appointment.id,
        coachId: appointment.coach_id,
        studentId: appointment.student_id,
        timeSlotId: appointment.time_slot_id,
        startTime: appointment.start_time,
        endTime: appointment.end_time,
        status: appointment.status as Appointment['status'],
        paymentStatus: appointment.payment_status as Appointment['paymentStatus'],
        paymentId: appointment.payment_id || undefined,
        notes: appointment.notes || '',
        createdAt: appointment.created_at
      }));
    } catch (error) {
      console.error('Error fetching student appointments:', error);
      throw error;
    }
  },
  
  // Get appointment by ID
  getAppointmentById: async (id: string): Promise<Appointment | null> => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null; // No rows returned
        throw error;
      }
      
      if (!data) return null;
      
      // Map snake_case database fields to camelCase application model
      return {
        id: data.id,
        coachId: data.coach_id,
        studentId: data.student_id,
        timeSlotId: data.time_slot_id,
        startTime: data.start_time,
        endTime: data.end_time,
        status: data.status as Appointment['status'],
        paymentStatus: data.payment_status as Appointment['paymentStatus'],
        paymentId: data.payment_id || undefined,
        notes: data.notes || '',
        createdAt: data.created_at
      };
    } catch (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
  },
  
  // Create new appointment
  createAppointment: async (appointment: Omit<Appointment, "id" | "createdAt">): Promise<Appointment> => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          coach_id: appointment.coachId,
          student_id: appointment.studentId,
          time_slot_id: appointment.timeSlotId,
          start_time: appointment.startTime,
          end_time: appointment.endTime,
          status: appointment.status,
          payment_status: appointment.paymentStatus,
          payment_id: appointment.paymentId || null,
          notes: appointment.notes || '',
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Map snake_case database fields to camelCase application model
      return {
        id: data.id,
        coachId: data.coach_id,
        studentId: data.student_id,
        timeSlotId: data.time_slot_id,
        startTime: data.start_time,
        endTime: data.end_time,
        status: data.status as Appointment['status'],
        paymentStatus: data.payment_status as Appointment['paymentStatus'],
        paymentId: data.payment_id || undefined,
        notes: data.notes || '',
        createdAt: data.created_at
      };
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },
  
  // Update appointment status
  updateAppointmentStatus: async (id: string, status: Appointment["status"]): Promise<Appointment> => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Map snake_case database fields to camelCase application model
      return {
        id: data.id,
        coachId: data.coach_id,
        studentId: data.student_id,
        timeSlotId: data.time_slot_id,
        startTime: data.start_time,
        endTime: data.end_time,
        status: data.status as Appointment['status'],
        paymentStatus: data.payment_status as Appointment['paymentStatus'],
        paymentId: data.payment_id || undefined,
        notes: data.notes || '',
        createdAt: data.created_at
      };
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  },
  
  // Update appointment payment - renamed to match interface
  updatePaymentStatus: async (
    id: string, 
    paymentStatus: Appointment["paymentStatus"], 
    paymentId?: string
  ): Promise<Appointment> => {
    try {
      const updateData: any = { payment_status: paymentStatus };
      if (paymentId) updateData.payment_id = paymentId;
      
      const { data, error } = await supabase
        .from('appointments')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Map snake_case database fields to camelCase application model
      return {
        id: data.id,
        coachId: data.coach_id,
        studentId: data.student_id,
        timeSlotId: data.time_slot_id,
        startTime: data.start_time,
        endTime: data.end_time,
        status: data.status as Appointment['status'],
        paymentStatus: data.payment_status as Appointment['paymentStatus'],
        paymentId: data.payment_id || undefined,
        notes: data.notes || '',
        createdAt: data.created_at
      };
    } catch (error) {
      console.error('Error updating appointment payment:', error);
      throw error;
    }
  }
};
