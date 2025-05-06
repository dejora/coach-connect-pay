
import { TimeSlotProvider } from '../types';
import { TimeSlot } from '@/types';
import { parseISO, isAfter, isBefore, addDays } from 'date-fns';

// Mock data
let mockTimeSlots: TimeSlot[] = [
  {
    id: 'slot-1',
    coachId: 'coach-1',
    startTime: '2025-05-10T10:00:00Z',
    endTime: '2025-05-10T11:00:00Z',
    isBooked: false
  },
  {
    id: 'slot-2',
    coachId: 'coach-1',
    startTime: '2025-05-10T11:00:00Z',
    endTime: '2025-05-10T12:00:00Z',
    isBooked: true
  },
  {
    id: 'slot-3',
    coachId: 'coach-1',
    startTime: '2025-05-11T10:00:00Z',
    endTime: '2025-05-11T11:00:00Z',
    isBooked: false
  },
  {
    id: 'slot-4',
    coachId: 'coach-2',
    startTime: '2025-05-10T14:00:00Z',
    endTime: '2025-05-10T15:00:00Z',
    isBooked: false
  }
];

export const mockTimeSlotProvider: TimeSlotProvider = {
  getTimeSlotsByCoach: async (coachId: string, startDate: string, endDate: string) => {
    const startDateObj = parseISO(startDate);
    const endDateObj = parseISO(endDate);
    
    return mockTimeSlots.filter(slot => 
      slot.coachId === coachId && 
      isAfter(parseISO(slot.startTime), startDateObj) && 
      isBefore(parseISO(slot.startTime), endDateObj)
    );
  },
  
  createTimeSlot: async (timeSlot: Omit<TimeSlot, 'id'>) => {
    const newSlot = {
      ...timeSlot,
      id: `slot-${mockTimeSlots.length + 1}`
    };
    mockTimeSlots.push(newSlot);
    return newSlot;
  },
  
  deleteTimeSlot: async (id: string) => {
    mockTimeSlots = mockTimeSlots.filter(slot => slot.id !== id);
  },
  
  updateTimeSlot: async (timeSlot: TimeSlot) => {
    mockTimeSlots = mockTimeSlots.map(slot => 
      slot.id === timeSlot.id ? timeSlot : slot
    );
    return timeSlot;
  }
};
