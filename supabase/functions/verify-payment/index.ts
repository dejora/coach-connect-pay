
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle preflight CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Create Supabase client with service role key for admin access
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    // Get user authentication
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseAdmin.auth.getUser(token);
    const user = userData.user;
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Parse request body
    const { sessionId } = await req.json();
    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Verify payment status
    if (session.payment_status !== "paid") {
      return new Response(JSON.stringify({ 
        success: false, 
        message: "Payment not completed" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Extract metadata
    const { coachId, sessionDate, userId } = session.metadata || {};
    
    // Verify user is the one who made the payment
    if (userId !== user.id) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: "User verification failed" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    // Get time slot information from metadata and find it in the database
    const { data: timeSlotData, error: timeSlotError } = await supabaseAdmin
      .from('coach_time_slots')
      .select('*')
      .eq('coach_id', coachId)
      .eq('is_booked', false);

    if (timeSlotError) throw timeSlotError;

    // Find the closest time slot to the session date
    const sessionDateObj = new Date(sessionDate);
    let closestSlot = null;
    let minimumDifference = Infinity;

    for (const slot of timeSlotData) {
      const slotDate = new Date(slot.start_time);
      const difference = Math.abs(sessionDateObj.getTime() - slotDate.getTime());
      
      if (difference < minimumDifference) {
        minimumDifference = difference;
        closestSlot = slot;
      }
    }

    if (!closestSlot) {
      throw new Error("No matching time slot found");
    }

    // Mark the time slot as booked
    const { error: updateError } = await supabaseAdmin
      .from('coach_time_slots')
      .update({ is_booked: true })
      .eq('id', closestSlot.id);

    if (updateError) throw updateError;

    // Create appointment record
    const { data: appointment, error: appointmentError } = await supabaseAdmin
      .from('appointments')
      .insert({
        coach_id: coachId,
        student_id: user.id,
        time_slot_id: closestSlot.id,
        start_time: closestSlot.start_time,
        end_time: closestSlot.end_time,
        status: 'confirmed',
        payment_status: 'paid',
        payment_id: sessionId
      })
      .select()
      .single();

    if (appointmentError) throw appointmentError;

    return new Response(JSON.stringify({ 
      success: true,
      appointment: appointment
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    // Return error information
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Payment verification error: ${errorMessage}`);
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
