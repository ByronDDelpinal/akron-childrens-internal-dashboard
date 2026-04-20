/**
 * Google Drive Edge Function
 *
 * Creates meeting documents by copying template Google Docs into the
 * correct folder based on meeting type. For committee meetings, it also
 * replaces [Date] and [Committee] placeholders in the copied docs.
 *
 * Creates a meeting-specific subfolder so all docs for one meeting live
 * together, and returns the folder URL alongside the document URLs.
 *
 * POST body:
 *   {
 *     meetingTitle: string,
 *     meetingDate: string,       // "2026-06-01"
 *     meetingType: "full_board" | "committee" | "special" | "social",
 *     committee?: string         // e.g. "Finance" — required when meetingType is "committee"
 *   }
 *
 * Response:
 *   {
 *     folderUrl: string,          // URL of the meeting-specific subfolder
 *     folderId: string,
 *     parentFolderUrl: string,    // URL of the type-level folder (e.g. Board Meetings)
 *     rootFolderUrl: string,      // URL of the top-level Drive folder
 *     agendaUrl: string,
 *     agendaId: string,
 *     minutesUrl: string,
 *     minutesId: string
 *   }
 *
 * Required secrets:
 *   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN
 *
 *   GOOGLE_ROOT_FOLDER_ID              — top-level "Board & Committee Meeting Materials" folder
 *   GOOGLE_BOARD_FOLDER_ID             — "Board Meetings" subfolder
 *   GOOGLE_BOARD_AGENDA_TEMPLATE_ID    — board agenda template doc
 *   GOOGLE_BOARD_MINUTES_TEMPLATE_ID   — board minutes template doc
 *   GOOGLE_COMMITTEE_FOLDER_ID         — "Committee Meetings" subfolder
 *   GOOGLE_COMMITTEE_AGENDA_TEMPLATE_ID  — committee agenda template doc
 *   GOOGLE_COMMITTEE_MINUTES_TEMPLATE_ID — committee minutes template doc
 *   GOOGLE_COMMITTEE_FOLDER_MAP        — JSON: { "Finance": "folderId", "Executive": "folderId", ... }
 *   GOOGLE_GENERIC_AGENDA_TEMPLATE_ID  — generic agenda template (special, social, etc.)
 *   GOOGLE_GENERIC_MINUTES_TEMPLATE_ID — generic minutes template
 */

import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import {
  getAccessToken,
  corsHeaders,
  errorResponse,
  jsonResponse,
} from "../_shared/google.ts";

interface DriveRequest {
  meetingTitle: string;
  meetingDate: string;
  meetingType: string;
  committee?: string;
}

/**
 * Create a subfolder inside a parent folder.
 */
async function createFolder(
  accessToken: string,
  name: string,
  parentId: string
): Promise<{ id: string; url: string }> {
  const response = await fetch("https://www.googleapis.com/drive/v3/files", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Folder creation failed (${response.status}): ${body}`);
  }

  const folder = await response.json();
  return {
    id: folder.id,
    url: `https://drive.google.com/drive/folders/${folder.id}`,
  };
}

/**
 * Copy a Google Doc template into the target folder with a new name.
 * Retries once on 5xx errors (transient Google API failures).
 */
async function copyTemplate(
  accessToken: string,
  templateId: string,
  name: string,
  folderId: string,
  attempt = 1
): Promise<{ id: string; url: string }> {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${templateId}/copy`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        parents: [folderId],
      }),
    }
  );

  if (!response.ok) {
    const body = await response.text();

    // Retry once on transient 5xx errors
    if (response.status >= 500 && attempt < 3) {
      console.warn(`Retrying copy for "${name}" (attempt ${attempt + 1})...`);
      await new Promise((r) => setTimeout(r, 1000 * attempt));
      return copyTemplate(accessToken, templateId, name, folderId, attempt + 1);
    }

    throw new Error(
      `Drive copy failed for "${name}" (${response.status}): ${body}`
    );
  }

  const file = await response.json();
  return {
    id: file.id,
    url: `https://docs.google.com/document/d/${file.id}/edit`,
  };
}

/**
 * Replace placeholder text inside a Google Doc using the Docs API.
 * Each replacement is a { find, replace } pair.
 */
async function replacePlaceholders(
  accessToken: string,
  docId: string,
  replacements: { find: string; replace: string }[]
): Promise<void> {
  const requests = replacements.map(({ find, replace }) => ({
    replaceAllText: {
      containsText: { text: find, matchCase: true },
      replaceText: replace,
    },
  }));

  const response = await fetch(
    `https://docs.googleapis.com/v1/documents/${docId}:batchUpdate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requests }),
    }
  );

  if (!response.ok) {
    const body = await response.text();
    console.error(`Placeholder replacement failed (${response.status}): ${body}`);
    // Non-fatal — docs are still usable, just with unreplaced placeholders
  }
}

/**
 * Format a date string (YYYY-MM-DD) as MM/YY for template placeholders.
 */
function formatDateMMYY(dateStr: string): string {
  const [year, month] = dateStr.split("-");
  return `${month}/${year.slice(2)}`;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return errorResponse("Method not allowed", 405);
  }

  try {
    const { meetingTitle, meetingDate, meetingType, committee }: DriveRequest =
      await req.json();

    if (!meetingTitle || !meetingDate || !meetingType) {
      return errorResponse(
        "meetingTitle, meetingDate, and meetingType are required."
      );
    }

    if (meetingType === "committee" && !committee) {
      return errorResponse(
        "committee is required when meetingType is 'committee'."
      );
    }

    // ── Resolve folder and template IDs based on meeting type ──

    const rootFolderId = Deno.env.get("GOOGLE_ROOT_FOLDER_ID");
    let parentFolderId: string | undefined;
    let agendaTemplateId: string | undefined;
    let minutesTemplateId: string | undefined;

    if (meetingType === "full_board") {
      parentFolderId = Deno.env.get("GOOGLE_BOARD_FOLDER_ID");
      agendaTemplateId = Deno.env.get("GOOGLE_BOARD_AGENDA_TEMPLATE_ID");
      minutesTemplateId = Deno.env.get("GOOGLE_BOARD_MINUTES_TEMPLATE_ID");
    } else if (meetingType === "committee") {
      // For committee meetings, look up the specific committee subfolder
      const folderMapStr = Deno.env.get("GOOGLE_COMMITTEE_FOLDER_MAP");
      if (!folderMapStr) {
        return errorResponse(
          "Missing GOOGLE_COMMITTEE_FOLDER_MAP secret.",
          500
        );
      }

      try {
        const folderMap = JSON.parse(folderMapStr);
        parentFolderId = folderMap[committee!];
      } catch {
        return errorResponse(
          "GOOGLE_COMMITTEE_FOLDER_MAP is not valid JSON.",
          500
        );
      }

      if (!parentFolderId) {
        // Fall back to the general committee folder if no specific subfolder
        parentFolderId = Deno.env.get("GOOGLE_COMMITTEE_FOLDER_ID");
      }

      agendaTemplateId = Deno.env.get("GOOGLE_COMMITTEE_AGENDA_TEMPLATE_ID");
      minutesTemplateId = Deno.env.get("GOOGLE_COMMITTEE_MINUTES_TEMPLATE_ID");
    } else {
      // special / social — use generic templates, create subfolder in root
      parentFolderId = rootFolderId;
      agendaTemplateId = Deno.env.get("GOOGLE_GENERIC_AGENDA_TEMPLATE_ID");
      minutesTemplateId = Deno.env.get("GOOGLE_GENERIC_MINUTES_TEMPLATE_ID");
    }

    if (!rootFolderId || !parentFolderId || !agendaTemplateId || !minutesTemplateId) {
      return errorResponse(
        "Missing Drive configuration. Check that all GOOGLE_*_FOLDER_ID and GOOGLE_*_TEMPLATE_ID secrets are set.",
        500
      );
    }

    const accessToken = await getAccessToken();
    const dateLabel = formatDateMMYY(meetingDate);

    // ── Step 1: Create a meeting-specific subfolder ──

    const folderName =
      meetingType === "committee"
        ? `${dateLabel} ${committee} Committee Meeting`
        : `${dateLabel} ${meetingTitle}`;

    const meetingFolder = await createFolder(
      accessToken,
      folderName,
      parentFolderId
    );

    // ── Step 2: Copy both templates into the meeting folder in parallel ──

    const agendaName =
      meetingType === "committee"
        ? `${dateLabel} ${committee} Committee Meeting Agenda`
        : `${dateLabel} ${meetingTitle} Agenda`;

    const minutesName =
      meetingType === "committee"
        ? `${dateLabel} ${committee} Committee Meeting Minutes`
        : `${dateLabel} ${meetingTitle} Minutes`;

    // Copy sequentially to avoid Google API rate-limit 500s
    const agenda = await copyTemplate(accessToken, agendaTemplateId, agendaName, meetingFolder.id);
    const minutes = await copyTemplate(accessToken, minutesTemplateId, minutesName, meetingFolder.id);

    // ── Step 3: Replace placeholders in the copied docs ──

    const replacements = [{ find: "[Date]", replace: dateLabel }];

    if (meetingType === "committee" && committee) {
      replacements.push({ find: "[Committee]", replace: committee });
    }

    await Promise.all([
      replacePlaceholders(accessToken, agenda.id, replacements),
      replacePlaceholders(accessToken, minutes.id, replacements),
    ]);

    // ── Done — return all URLs ──

    return jsonResponse({
      folderUrl: meetingFolder.url,
      folderId: meetingFolder.id,
      parentFolderUrl: `https://drive.google.com/drive/folders/${parentFolderId}`,
      rootFolderUrl: `https://drive.google.com/drive/folders/${rootFolderId}`,
      agendaUrl: agenda.url,
      agendaId: agenda.id,
      minutesUrl: minutes.url,
      minutesId: minutes.id,
    });
  } catch (err) {
    console.error("Google Drive error:", err);
    return errorResponse(err.message || "Internal server error", 500);
  }
});
