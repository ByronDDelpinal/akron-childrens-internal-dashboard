/**
 * Google Calendar Edge Function
 *
 * Creates a calendar event with meeting details and board members as attendees.
 * Attendees receive email invites automatically from Google.
 *
 * POST body:
 *   {
 *     title: string,
 *     date: string,          // "2026-06-01"
 *     startTime: string,     // "11:30"
 *     endTime: string,       // "13:00"
 *     location?: string,
 *     description?: string,
 *     attendeeEmails: string[]
 *   }
 *
 * Response:
 *   { eventId: string, eventUrl: string }
 *
 * Required secrets:
 *   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN
 *   GOOGLE_CALENDAR_ID — "primary" for main calendar, or a specific calendar ID
 */

import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import {
  getAccessToken,
  corsHeaders,
  errorResponse,
  jsonResponse,
} from "../_shared/google.ts";

interface CalendarRequest {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  description?: string;
  attendeeEmails: string[];
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return errorResponse("Method not allowed", 405);
  }

  try {
    const body: CalendarRequest = await req.json();
    const { title, date, startTime, endTime, location, description, attendeeEmails } = body;

    if (!title || !date || !startTime || !endTime) {
      return errorResponse("title, date, startTime, and endTime are required.");
    }

    const calendarId = Deno.env.get("GOOGLE_CALENDAR_ID") || "primary";
    const accessToken = await getAccessToken();

    // Build the event object
    // Google Calendar API expects RFC3339 datetime with timezone
    const timeZone = "America/New_York";

    const event = {
      summary: title,
      location: location || undefined,
      description: description
        ? `${description}\n\n— Created by the ACM Board Portal`
        : "Created by the ACM Board Portal",
      start: {
        dateTime: `${date}T${startTime}:00`,
        timeZone,
      },
      end: {
        dateTime: `${date}T${endTime}:00`,
        timeZone,
      },
      attendees: (attendeeEmails || []).map((email: string) => ({ email })),
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 1440 }, // 24 hours before
          { method: "popup", minutes: 30 },    // 30 minutes before
        ],
      },
    };

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?sendUpdates=all`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Calendar event creation failed (${response.status}): ${errorBody}`);
    }

    const created = await response.json();

    return jsonResponse({
      eventId: created.id,
      eventUrl: created.htmlLink,
    });
  } catch (err) {
    console.error("Google Calendar error:", err);
    return errorResponse(err.message || "Internal server error", 500);
  }
});
