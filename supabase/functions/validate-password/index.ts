import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Only accept POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { password } = await req.json();

    if (!password || typeof password !== "string") {
      return new Response(
        JSON.stringify({ valid: false, error: "Password is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // The bcrypt hash is stored as a Supabase secret (environment variable).
    // Set it with: supabase secrets set BOARD_PASSWORD_HASH='$2a$10$...'
    const storedHash = Deno.env.get("BOARD_PASSWORD_HASH");

    if (!storedHash) {
      console.error("BOARD_PASSWORD_HASH secret is not set");
      return new Response(
        JSON.stringify({ valid: false, error: "Server configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const valid = await bcrypt.compare(password, storedHash);

    return new Response(JSON.stringify({ valid }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Password validation error:", err);
    return new Response(
      JSON.stringify({ valid: false, error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
