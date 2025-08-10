
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Define CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle preflight CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Create Supabase client
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    // Verify authentication
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user?.email) {
      throw new Error("User not authenticated or email not available");
    }

    // Parse request body
    const { coachId, sessionDate } = await req.json();
    
    if (!coachId || !sessionDate) {
      throw new Error("Missing required parameters: coachId or sessionDate");
    }

    // Fetch coach hourly rate from Supabase and compute amount server-side
    const { data: coachProfile, error: coachError } = await supabaseClient
      .from('profiles')
      .select('hourly_rate')
      .eq('id', coachId)
      .single();

    if (coachError || !coachProfile) {
      throw new Error("Coach not found");
    }

    let amountCents = Math.round(Number(coachProfile.hourly_rate || 0) * 100);
    if (!amountCents || amountCents < 100) amountCents = 5000; // default $50
    if (amountCents > 200000) amountCents = 200000; // cap at $2000
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if customer exists in Stripe
    const customers = await stripe.customers.list({ 
      email: user.email, 
      limit: 1 
    });
    
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      // Create new customer in Stripe
      const customer = await stripe.customers.create({ 
        email: user.email,
        metadata: {
          userId: user.id
        }
      });
      customerId = customer.id;
    }

    // Create payment session
    const origin = req.headers.get("origin") || "http://localhost:3000";
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Coaching Session',
              description: `Coaching session on ${sessionDate}`,
            },
            unit_amount: amountCents, // computed server-side (cents)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment-canceled`,
      metadata: {
        userId: user.id,
        coachId: coachId,
        sessionDate: sessionDate
      }
    });

    // Return the checkout URL for the client to redirect to
    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    // Return error information
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Stripe checkout error: ${errorMessage}`);
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
