
import { UserProvider } from '../types';
import { User, Coach, Student } from '@/types';

// Mock data
const mockUsers: User[] = [
  {
    id: 'coach-1',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    role: 'coach',
    profileImage: '/assets/coach1.jpg'
  },
  {
    id: 'coach-2',
    email: 'john.doe@example.com',
    name: 'John Doe',
    role: 'coach',
    profileImage: '/assets/coach2.jpg'
  },
  {
    id: 'student-1',
    email: 'alice@example.com',
    name: 'Alice Johnson',
    role: 'student'
  },
  {
    id: 'student-2',
    email: 'bob@example.com',
    name: 'Bob Wilson',
    role: 'student'
  }
];

const mockCoaches: Coach[] = [
  {
    id: 'coach-1',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    role: 'coach',
    profileImage: '/assets/coach1.jpg',
    bio: 'Experienced math and science tutor with 10+ years of teaching.',
    hourlyRate: 50,
    expertise: ['Mathematics', 'Physics', 'Chemistry'],
    rating: 4.9
  },
  {
    id: 'coach-2',
    email: 'john.doe@example.com',
    name: 'John Doe',
    role: 'coach',
    profileImage: '/assets/coach2.jpg',
    bio: 'Computer science specialist focusing on programming and web development.',
    hourlyRate: 60,
    expertise: ['Computer Science', 'Programming', 'Web Development'],
    rating: 4.7
  }
];

const mockStudents: Student[] = [
  {
    id: 'student-1',
    email: 'alice@example.com',
    name: 'Alice Johnson',
    role: 'student'
  },
  {
    id: 'student-2',
    email: 'bob@example.com',
    name: 'Bob Wilson',
    role: 'student'
  }
];

export const mockUserProvider: UserProvider = {
  getUserById: async (id: string) => {
    const user = mockUsers.find(user => user.id === id);
    return user || null;
  },
  
  getCoachById: async (id: string) => {
    const coach = mockCoaches.find(coach => coach.id === id);
    return coach || null;
  },
  
  getStudentById: async (id: string) => {
    const student = mockStudents.find(student => student.id === id);
    return student || null;
  },
  
  updateUser: async (userData: Partial<User> & { id: string }) => {
    const userIndex = mockUsers.findIndex(u => u.id === userData.id);
    
    if (userIndex >= 0) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
      
      // If it's a coach, update coach data too
      if (mockUsers[userIndex].role === 'coach') {
        const coachIndex = mockCoaches.findIndex(c => c.id === userData.id);
        if (coachIndex >= 0) {
          mockCoaches[coachIndex] = { ...mockCoaches[coachIndex], ...userData } as Coach;
        }
      }
      
      // If it's a student, update student data too
      if (mockUsers[userIndex].role === 'student') {
        const studentIndex = mockStudents.findIndex(s => s.id === userData.id);
        if (studentIndex >= 0) {
          mockStudents[studentIndex] = { ...mockStudents[studentIndex], ...userData } as Student;
        }
      }
      
      return mockUsers[userIndex];
    }
    
    throw new Error(`User with id ${userData.id} not found`);
  },
  
  getCoaches: async (limit?: number) => {
    return limit ? mockCoaches.slice(0, limit) : mockCoaches;
  }
};
