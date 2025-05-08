
export type UserRole = 'coach' | 'student' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profileImage?: string;
  isActive?: boolean;
}

export interface Coach extends User {
  role: 'coach';
  bio?: string;
  hourlyRate: number;
  expertise: string[];
  rating?: number;
  isActive: boolean;
}

export interface Student extends User {
  role: 'student';
}

export interface TimeSlot {
  id: string;
  coachId: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  isBooked: boolean;
}

export interface Appointment {
  id: string;
  coachId: string;
  studentId: string;
  timeSlotId: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentId?: string;
  notes?: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}


export interface Maintenance {
  init: () => Promise<void>;
  getMaintenanceStatus: () => Promise<boolean>;
}

export type DataSource = 'mock' | 'supabase' | 'postgresql';