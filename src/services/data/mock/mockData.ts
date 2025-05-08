
import { User, Coach, Student } from '@/types';

// Mock data for development
const mockData = {
  users: [
    {
      id: 'user-1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      isActive: true
    },
    {
      id: 'user-2',
      email: 'coach@example.com',
      name: 'Jane Smith',
      role: 'coach',
      isActive: true
    },
    {
      id: 'user-3',
      email: 'student@example.com',
      name: 'Alex Johnson',
      role: 'student',
      isActive: true
    }
  ] as User[],
  
  coaches: [
    {
      id: 'user-2',
      email: 'coach@example.com',
      name: 'Jane Smith',
      role: 'coach' as const,
      profileImage: '/images/avatars/coach-1.jpg',
      bio: 'Experienced mathematics coach with over 10 years of teaching experience.',
      hourlyRate: 60,
      expertise: ['Mathematics', 'Calculus', 'Statistics'],
      rating: 4.9,
      isActive: true
    },
    {
      id: 'coach-2',
      email: 'robert@example.com',
      name: 'Robert Chen',
      role: 'coach' as const,
      profileImage: '/images/avatars/coach-2.jpg',
      bio: 'Physics professor with specialization in quantum mechanics.',
      hourlyRate: 70,
      expertise: ['Physics', 'Engineering', 'Quantum Mechanics'],
      rating: 4.8,
      isActive: true
    },
    {
      id: 'coach-3',
      email: 'lisa@example.com',
      name: 'Lisa Johnson',
      role: 'coach' as const,
      bio: 'Biology specialist with focus on molecular biology.',
      hourlyRate: 55,
      expertise: ['Biology', 'Chemistry', 'Molecular Biology'],
      rating: 4.7,
      isActive: false
    }
  ] as Coach[],
  
  students: [
    {
      id: 'user-3',
      email: 'student@example.com',
      name: 'Alex Johnson',
      role: 'student' as const,
      profileImage: '/images/avatars/student-1.jpg',
      isActive: true
    },
    {
      id: 'student-2',
      email: 'sam@example.com',
      name: 'Sam Wilson',
      role: 'student' as const,
      isActive: true
    }
  ] as Student[]
};

export default mockData;
