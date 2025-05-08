import { BaseDataProvider } from '../BaseDataProvider';
import { supabaseTimeSlotProvider } from './supabaseTimeSlotProvider';
import { supabaseAppointmentProvider } from './supabaseAppointmentProvider';
import { supabaseUserProvider } from './supabaseUserProvider';
import { supabasePreferenceProvider } from './supabasePreferenceProvider';
import { supabase } from '@/integrations/supabase/client';

class SupabaseDataProvider extends BaseDataProvider {
  timeSlots = supabaseTimeSlotProvider;
  appointments = supabaseAppointmentProvider;
  users = supabaseUserProvider;
  preferences = supabasePreferenceProvider;

  async initialize(): Promise<void> {
    await this.createTables();
    await this.validateSchema();
    await this.seedData();
  }

  async isConnected(): Promise<boolean> {
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      return !error;
    } catch (err) {
      console.error('Error checking Supabase connection:', err);
      return false;
    }
  }

  async cleanup(): Promise<void> {
    // Nettoyer les connexions Supabase si nécessaire
  }

  protected async createTables(): Promise<void> {
    // Créer les tables si elles n'existent pas
    const queries = [
      `
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id),
        name TEXT,
        email TEXT UNIQUE,
        role TEXT CHECK (role IN ('coach', 'student', 'admin')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
      );
      `,
      `
      CREATE TABLE IF NOT EXISTS time_slots (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        coach_id UUID REFERENCES profiles(id),
        start_time TIMESTAMP WITH TIME ZONE,
        end_time TIMESTAMP WITH TIME ZONE,
        is_available BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
      );
      `,
      `
      CREATE TABLE IF NOT EXISTS appointments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        student_id UUID REFERENCES profiles(id),
        coach_id UUID REFERENCES profiles(id),
        time_slot_id UUID REFERENCES time_slots(id),
        status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
        payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'refunded')),
        payment_id TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
      );
      `,
      `
      CREATE TABLE IF NOT EXISTS preferences (
        key TEXT PRIMARY KEY,
        value JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
      );
      `
    ];

    for (const query of queries) {
      const { error } = await supabase.rpc('execute_sql', { query });
      if (error) throw error;
    }
  }

  protected async validateSchema(): Promise<boolean> {
    // Vérifier que toutes les tables nécessaires existent
    const requiredTables = ['profiles', 'time_slots', 'appointments', 'preferences'];
    for (const table of requiredTables) {
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', table)
        .single();
      
      if (error || !data) {
        throw new Error(`Table ${table} not found in database`);
      }
    }
    return true;
  }

  protected async seedData(): Promise<void> {
    // Vérifier si des données initiales sont nécessaires
    const { data: adminCount } = await supabase
      .from('profiles')
      .select('count')
      .eq('role', 'admin');

    if (!adminCount || adminCount[0].count === 0) {
      // Ajouter un admin par défaut si aucun n'existe
      const { data: adminUser, error } = await supabase.auth.signUp({
        email: 'admin@example.com',
        password: 'changeme123',
        options: {
          data: {
            role: 'admin',
            name: 'Admin User'
          }
        }
      });

      if (error) throw error;

      // Ajouter d'autres données initiales si nécessaire...
    }
  }
}

export const supabaseDataProvider = new SupabaseDataProvider();
