
import { AuthProvider } from './types';
import { mockAuthProvider } from './mock/mockAuthProvider';
import { supabaseAuthProvider } from './supabase/supabaseAuthProvider';

export { type AuthProvider } from './types';

export const getAuthProvider = (dataSource: 'mock' | 'supabase'): AuthProvider => {
  return dataSource === 'mock' ? mockAuthProvider : supabaseAuthProvider;
};
