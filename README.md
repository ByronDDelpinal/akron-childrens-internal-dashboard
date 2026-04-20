# Board Portal

A modern, mobile-friendly web portal for nonprofit board of directors. Built for the [Akron Children's Museum](https://akronkids.org), designed to be forked and adapted by any organization that needs a better way to keep their board organized.

**If your nonprofit board is drowning in email threads, scattered Google Drive links, and "can you resend that attachment?" messages — this project is for you.** Fork it, swap in your data, and give your board a real home base.

## What It Does

The portal replaces the chaos of email-and-Drive board management with a single, clean dashboard. Board members log in with a shared password and get immediate access to everything they need:

- **Dashboard** with upcoming meetings, announcements, recent updates, and financial overview charts sourced from IRS 990 filings
- **Meetings** page with upcoming/past views, type filtering, pagination, and one-click Google Calendar integration
- **Meeting detail** pages with attached documents (agendas, minutes, board packets), inline editing, and direct links to Google Drive folders
- **One-click meeting scheduling** that automatically creates a Google Drive folder with agenda and minutes docs from branded templates, replaces date/committee placeholders, links everything to the meeting, and optionally sends Google Calendar invites to all board members
- **Document library** with search, category filters, and links to external files (Google Drive, Dropbox, etc.)
- **Board directory** with contact info, committee assignments, term tracking, and expiration warnings
- **Proposals** workflow for submitting and tracking board action items with status management
- **Announcements** for manual posts and auto-generated activity updates
- **FAQ** page to help board members navigate the portal during the transition

Every create/update/delete action automatically posts to an activity feed so the board stays informed without extra effort.

## Tech Stack

This is a straightforward React SPA — no framework magic, no build complexity:

- **React 19** + **React Router 7** for UI and routing
- **Vite 8** for dev server and builds
- **Tailwind CSS 4** for styling (utility-first, no custom CSS files)
- **Supabase** for database (Postgres), auth (Edge Functions), and row-level security
- **Google APIs** (Drive, Docs, Calendar) via Supabase Edge Functions for meeting automation
- **Recharts** for financial data visualization
- **Lucide React** for icons
- **Vercel** for hosting (any static host works)

No state management library. No CSS-in-JS. No GraphQL. Just React hooks, Supabase queries, and Tailwind classes.

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works fine)
- A [Google Cloud](https://console.cloud.google.com) project (free tier, no billing required for low-volume use)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd acm-internal-dashboard
npm install
```

### 2. Set up environment variables

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_DEV_PASSWORD=yourdevpassword
```

The `VITE_DEV_PASSWORD` lets you log in during local development without needing the Supabase Edge Function deployed.

### 3. Set up the database

Run the SQL migrations in order against your Supabase project. You can do this through the Supabase SQL Editor or the CLI:

```
supabase/migrations/
  001_board_members.sql       # Creates board_members table
  002_seed_board_members.sql  # Seeds the roster (swap in your people)
  003_meetings.sql            # Creates meetings table
  004_documents.sql           # Creates documents + meeting_documents tables
  005_seed_meetings.sql       # Seeds the meeting schedule (swap in your dates)
  006_document_write_policies.sql
  007_announcements.sql       # Creates announcements table
  008_proposals.sql           # Creates proposals table
  009_updates.sql             # Creates updates table
  010_meeting_write_policies.sql
  011_meeting_drive_folders.sql  # Adds Google Drive folder URL columns
```

Run them in order (001 through 011). The seed files (002, 005) contain our data — replace the values with your own board members and meeting schedule.

### 4. Set up the password gate

The portal uses a shared password for simple access control. Generate a bcrypt hash:

```bash
node scripts/generate-hash.mjs
```

Then set it as a Supabase secret:

```bash
supabase secrets set BOARD_PASSWORD_HASH='your-hash-here'
```

Deploy the `validate-password` Edge Function:

```bash
supabase functions deploy validate-password
```

### 5. Set up Google integration (optional but recommended)

The portal can automatically create Google Drive documents and send Google Calendar invites when you schedule a meeting. This is optional — the portal works without it, but it's what makes the "push a button and everything happens" experience.

#### a) Create a Google Cloud project

Go to [console.cloud.google.com](https://console.cloud.google.com) and create a new project (or use an existing one). Then enable these three APIs from the API Library:

- **Google Drive API**
- **Google Docs API**
- **Google Calendar API**

All three are free at the volume a board portal generates. You do not need to enable billing.

#### b) Create OAuth credentials

In the Google Cloud Console, go to **Google Auth Platform** → **Clients** → **+ Create Client**. Select **Desktop app** as the application type and name it something like `Board Portal CLI`. Copy the **Client ID** and **Client Secret**.

> **Note:** If this is a new project, you may need to configure the OAuth consent screen first (Branding and Audience sections). Set the app to "Internal" if using Google Workspace, or "External" with your own email as a test user for personal accounts.

#### c) Create the Drive folder structure

You have two options:

**Option A: Automatic (recommended).** Run the scaffold script after completing step (d) below:

```bash
node scripts/scaffold-drive.mjs
```

This creates the full folder hierarchy in your Google Drive, including template documents for board meetings, committee meetings, and general meetings. It outputs all the `supabase secrets set` commands you need. You can customize the committees and template content afterward in Google Docs.

**Option B: Manual.** Create the following structure in Google Drive yourself:

```
Board & Committee Meeting Materials/       ← root folder
  Board Meetings/
    [Template] Board Meeting Agenda        ← Google Doc
    [Template] Board Meeting Minutes       ← Google Doc
  Committee Meetings/
    Development Committee Meetings/
    Executive Committee Meetings/
    Finance Committee Meetings/
    Governance Committee Meetings/
    [Template] Committee Meeting Agenda    ← Google Doc with [Date] and [Committee] placeholders
    [Template] Committee Meeting Minutes   ← Google Doc with [Date] and [Committee] placeholders
  [Template] Generic Meeting Agenda        ← Google Doc with [Date] placeholder
  [Template] Generic Meeting Minutes       ← Google Doc with [Date] placeholder
```

Templates can use `[Date]` and `[Committee]` as placeholders — they'll be automatically replaced when a meeting is created. `[Date]` becomes `MM/YY` format. `[Committee]` becomes the committee name (e.g., "Finance").

#### d) Run the auth script

```bash
node scripts/google-auth.mjs
```

This prompts for your Client ID and Client Secret, opens your browser for Google authorization, and outputs the `supabase secrets set` commands for your credentials. The OAuth consent screen will request:

- **"See all your Google Drive files"** — read-only access, needed to copy your template documents
- **"See, edit, create, and delete only the specific Google Drive files you use with this app"** — only applies to files the portal creates (meeting folders and docs), not your existing files
- **"View and edit events on all your calendars"** — for creating meeting calendar events

#### e) Set the Drive folder and template secrets

If you used the scaffold script (Option A), it already printed these commands. If you set up folders manually (Option B), you'll need to set each secret with the folder and document IDs from your Drive URLs:

```bash
supabase secrets set GOOGLE_ROOT_FOLDER_ID='your-root-folder-id'
supabase secrets set GOOGLE_BOARD_FOLDER_ID='your-board-meetings-folder-id'
supabase secrets set GOOGLE_BOARD_AGENDA_TEMPLATE_ID='your-board-agenda-template-doc-id'
supabase secrets set GOOGLE_BOARD_MINUTES_TEMPLATE_ID='your-board-minutes-template-doc-id'
supabase secrets set GOOGLE_COMMITTEE_FOLDER_ID='your-committee-meetings-folder-id'
supabase secrets set GOOGLE_COMMITTEE_AGENDA_TEMPLATE_ID='your-committee-agenda-template-doc-id'
supabase secrets set GOOGLE_COMMITTEE_MINUTES_TEMPLATE_ID='your-committee-minutes-template-doc-id'
supabase secrets set GOOGLE_COMMITTEE_FOLDER_MAP='{"Executive":"folder-id","Finance":"folder-id","Governance":"folder-id","Development":"folder-id"}'
supabase secrets set GOOGLE_GENERIC_AGENDA_TEMPLATE_ID='your-generic-agenda-template-doc-id'
supabase secrets set GOOGLE_GENERIC_MINUTES_TEMPLATE_ID='your-generic-minutes-template-doc-id'
supabase secrets set GOOGLE_CALENDAR_ID='primary'
```

To find a folder ID, open it in Drive and copy from the URL: `drive.google.com/drive/folders/{THIS_PART}`. For a doc ID: `docs.google.com/document/d/{THIS_PART}/edit`.

#### f) Deploy the Edge Functions

```bash
supabase functions deploy google-drive --no-verify-jwt
supabase functions deploy google-calendar --no-verify-jwt
```

The `--no-verify-jwt` flag is required because the portal uses a shared password gate instead of Supabase Auth.

#### That's it!

When you schedule a meeting with the "Create agenda & minutes in Google Drive" checkbox enabled, the portal will:

1. Create a meeting-specific subfolder in the correct Drive folder
2. Copy the appropriate templates (board, committee, or generic) into that folder
3. Replace `[Date]` and `[Committee]` placeholders in the new documents
4. Link the documents and folder URLs to the meeting in the portal
5. Optionally send Google Calendar invites to all active board members

**Switching Google accounts later:** When you get access to the organization's Google Workspace, revoke the old access at [myaccount.google.com/permissions](https://myaccount.google.com/permissions), run `google-auth.mjs` again with the new account, update the credential secrets, and point the folder/template IDs to the org's Drive. Zero code changes needed.

### 6. Run it

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and log in with your dev password.

## Project Structure

```
src/
  pages/          # One file per route (Dashboard, Meetings, Directory, etc.)
  components/     # Reusable UI organized by feature
    ui/           # Generic primitives (Card, Badge, SlideOver, etc.)
    meetings/     # Meeting-specific forms (Add, Edit)
    documents/    # Document-specific forms
    proposals/    # Proposal-specific forms
    directory/    # Board member card and avatar
  hooks/          # Data fetching, mutations, and Google integration
  data/           # Helper functions for sorting, filtering, formatting
  lib/            # Supabase client, design tokens, formatters, constants
supabase/
  functions/
    _shared/      # Shared Google OAuth helpers
    validate-password/  # Password gate Edge Function
    google-drive/       # Creates folders + docs from templates in Google Drive
    google-calendar/    # Creates calendar events with attendee invites
  migrations/     # SQL schema + seed data (run these to set up your DB)
scripts/
  generate-hash.mjs    # CLI tool for generating the portal password hash
  google-auth.mjs      # CLI tool for Google OAuth2 authorization
  scaffold-drive.mjs   # CLI tool for creating the Drive folder structure
```

The architecture is intentionally flat. Pages fetch data via hooks, render components, and manage local UI state. There's no global state management — each hook talks directly to Supabase.

## Deploying

The app builds to static files. Deploy anywhere that serves HTML:

```bash
npm run build
```

For Vercel (what we use), just connect your repo and it auto-deploys. The included `vercel.json` handles SPA routing.

For other hosts (Netlify, Cloudflare Pages, etc.), make sure all routes redirect to `index.html` for client-side routing to work.

## Adapting This for Your Organization

This was built for a children's museum board, but the bones are generic. Here's what to change to make it yours:

1. **Brand colors**: Update the `@theme` block in `src/index.css` and the matching values in `src/lib/tokens.js`. The whole app will follow.

2. **Board members**: Edit `supabase/migrations/002_seed_board_members.sql` with your roster, then run it against your database.

3. **Meeting schedule**: Edit `supabase/migrations/005_seed_meetings.sql` with your dates and cadence.

4. **Committees**: Update the `COMMITTEE_PRESETS` in `src/components/meetings/AddMeetingForm.jsx` and the `GOOGLE_COMMITTEE_FOLDER_MAP` secret to match your committees.

5. **Meeting templates**: Customize the Google Doc templates with your organization's logo, branding, and agenda structure. The portal copies them as-is, so what you see in the template is what gets created for each meeting.

6. **Financial data**: Replace `src/data/financials.js` with your organization's 990 filing data (or remove the financial charts from the Dashboard if you don't need them).

7. **FAQ content**: Update the questions and answers in `src/pages/FAQ.jsx` to match your organization's context.

8. **Logo and name**: Replace references to "Akron Children's Museum" in the Layout component and anywhere else they appear.

The password gate, meeting/document/proposal workflows, Google integration, and auto-update system all work out of the box regardless of the organization.

## Why We Built This

Nonprofit boards run on volunteer time. Every minute a board member spends hunting for a meeting agenda in their email or asking "where's the latest budget?" is a minute not spent on the mission.

We built this because the existing tools (email threads, shared Google Drive folders, group texts) stopped scaling as the board grew. The portal doesn't replace those tools — it organizes them into one place so nothing gets lost.

If your board is in the same boat, please take this and make it your own. Nonprofit technology shouldn't be a luxury.

## Contributing

Found a bug? Have an idea? Open an issue or submit a pull request. This is a community project and contributions are welcome.

## License

MIT — use it however you'd like, no strings attached.
