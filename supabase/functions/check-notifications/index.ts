import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Event {
  id: string;
  user_id: string;
  title: string;
  date: string;
  time: string;
  notification_enabled: boolean;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get current time
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    console.log(`Checking notifications for date: ${currentDate}, time: ${currentTime}`);

    // Query events that need notifications
    const { data: events, error } = await supabase
      .from("events")
      .select("id, user_id, title, date, time, notification_enabled")
      .eq("notification_enabled", true)
      .eq("date", currentDate)
      .gte("time", currentTime)
      .lte("time", `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes() + 1).padStart(2, "0")}`);

    if (error) {
      console.error("Error fetching events:", error);
      throw error;
    }

    console.log(`Found ${events?.length || 0} events to notify`);

    // Here you could:
    // 1. Send email notifications via Resend
    // 2. Send push notifications
    // 3. Store notifications in a notifications table for users to see when they log in
    
    // For now, we'll just log them
    if (events && events.length > 0) {
      for (const event of events) {
        console.log(`Event notification: ${event.title} for user ${event.user_id} at ${event.time}`);
        
        // You could insert into a notifications table here
        // await supabase.from("notifications").insert({
        //   user_id: event.user_id,
        //   event_id: event.id,
        //   message: `${event.title} is starting now!`,
        //   read: false,
        // });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        checked: events?.length || 0,
        message: `Checked ${events?.length || 0} events for notifications`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in check-notifications function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
