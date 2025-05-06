
import { supabase } from '@/integrations/supabase/client';
import { Appointment } from '@/types';

export const supabaseAppointmentProvider = {
  // Get appointments by coach ID
  getAppointmentsByCoachId: async (coachId: string): Promise<Appointment[]> => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('coachId', coachId);
      
      if (error) throw error;
      
      return data.map(appointment => ({
        ...appointment,
        status: appointment.status as Appointment['status'],
        paymentStatus: appointment.paymentStatus as Appointment['paymentStatus']
      }));
    } catch (error) {
      console.error('Error fetching coach appointments:', error);
      throw error;
    }
  },
  
  // Get appointments by student ID
  getAppointmentsByStudentId: async (studentId: string): Promise<Appointment[]> => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('studentId', studentId);
      
      if (error) throw error;
      
      return data.map(appointment => ({
        ...appointment,
        status: appointment.status as Appointment['status'],
        paymentStatus: appointment.paymentStatus as Appointment['paymentStatus']
      }));
    } catch (error) {
      console.error('Error fetching student appointments:', error);
      throw error;
    }
  },
  
  // Get appointment by ID
  getAppointmentById: async (id: string): Promise<Appointment> => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        status: data.status as Appointment['status'],
        paymentStatus: data.paymentStatus as Appointment['paymentStatus']
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
          coachId: appointment.coachId,
          studentId: appointment.studentId,
          timeSlotId: appointment.timeSlotId,
          startTime: appointment.startTime,
          endTime: appointment.endTime,
          status: appointment.status,
          paymentStatus: appointment.paymentStatus,
          paymentId: appointment.paymentId || null,
          notes: appointment.notes || '',
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        status: data.status as Appointment['status'],
        paymentStatus: data.paymentStatus as Appointment['paymentStatus']
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
      
      return {
        ...data,
        status: data.status as Appointment['status'],
        paymentStatus: data.paymentStatus as Appointment['paymentStatus']
      };
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  },
  
  // Update appointment payment
  updateAppointmentPayment: async (
    id: string, 
    paymentStatus: Appointment["paymentStatus"], 
    paymentId?: string
  ): Promise<Appointment> => {
    try {
      const updateData: any = { paymentStatus };
      if (paymentId) updateData.paymentId = paymentId;
      
      const { data, error } = await supabase
        .from('appointments')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        status: data.status as Appointment['status'],
        paymentStatus: data.paymentStatus as Appointment['paymentStatus']
      };
    } catch (error) {
      console.error('Error updating appointment payment:', error);
      throw error;
    }
  }
};
