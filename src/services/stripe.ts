
import { supabase } from '@/integrations/supabase/client';

// Function to create a checkout session for a coaching session
export async function createCheckoutSession(coachId: string, sessionDate: string) {
  try {
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { 
        coachId, 
        sessionDate 
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

// Function to verify payment status after checkout
export async function verifyPayment(sessionId: string) {
  try {
    const { data, error } = await supabase.functions.invoke('verify-payment', {
      body: { sessionId }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
}
