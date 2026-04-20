# Board Portal

A modern, mobile-friendly web portal for nonprofit board of directors. Built for the [Akron Children's Museum](https://akronkids.org), designed to be forked and adapted by any organization that needs a better way to keep their board organized.

**If your nonprofit board is drowning in email threads, scattered Google Drive links, and "can you resend that attachment?" messages — this project is for you.** Fork it, swap in your data, and give your board a real home base.

## What It Does

The portal replaces the chaos of email-and-Drive board management with a single, clean dashboard. Board members log in with a shared password and get immediate access to everything they need:

- **Dashboard** with upcoming meetings, announcements, recent updates, and financial overview charts sourced from IRS 990 filings
- **Meetings** page with upcoming/past views, type filtering, pagination, and one-click Google Calendar integration
- **Meeting detail** pages with attached documents (agendas, minutes, board packets) and inline editing
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
- **Recharts** for financial data visualization
- **Lucide React** for icons
- **Vercel** for hosting (any static host works)

No state management library. No CSS-in-JS. No GraphQL. Just React hooks, Supabase queries, and Tailwind classes.

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works fine)

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
```

Run them in order (001 through 010). The seed files (002, 005) contain our data — replace the values with your own board members and meeting schedule.

### 4. Set up the password gate

The portal uses a shared password for simple access control. Generate a bcrypt hash:

```bash
node scripts/generate-hash.mjs
```

Then set it as a Supabase secret:

```bash
supabase secrets set BOARD_PASSWORD_HASH='your-hash-here'
```

You'll also need to deploy the `validate-password` Edge Function. See the Supabase docs on [Edge Functions](https://supabase.com/docs/guides/functions) for deployment steps.

### 5. Set up Google integration (optional but recommended)

The portal can automatically create Google Drive documents and send Google Calendar invites when you schedule a meeting. This is optional — the portal works without it, but it's what makes the "push a button and everything happens" experience.

**a) Create a Google Cloud project**

Go to [console.cloud.google.com](https://console.cloud.google.com), create a new project (or use an existing one), and enable the **Google Drive API** and **Google Calendar API** from the API Library.

**b) Create OAuth2 credentials**

In the Google Cloud Console, go to APIs & Services → Credentials → Create Credentials → OAuth client ID. Choose "Desktop app" as the application type. Download or copy the Client ID and Client Secret.

**c) Create your template documents**

Create two Google Docs that will serve as your agenda and minutes templates. Format them however you'd like — they'll be copied and renamed for each new meeting. Note the document ID from each URL (the long string in `docs.google.com/document/d/{THIS_PART}/edit`).

**d) Create a board documents folder**

Create a folder in Google Drive where all meeting documents will live. Note the folder ID from the URL (`drive.google.com/drive/folders/{THIS_PART}`).

**e) Run the auth script**

```bash
node scripts/google-auth.mjs
```

This opens your browser for Google authorization, then outputs the `supabase secrets set` commands you need to run. It will prompt you for your Client ID and Client Secret.

**f) Deploy the Edge Functions**

```bash
supabase functions deploy google-drive
supabase functions deploy google-calendar
```

That's it. When you schedule a meeting with the "Create agenda & minutes in Google Drive" and "Send calendar invites" checkboxes enabled, the portal handles everything automatically.

**Switching Google accounts later:** When you get access to the organization's Google Workspace, just run the auth script again with the new credentials, update the Supabase secrets, and point the folder/template IDs to the org's Drive. Zero code changes needed.

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
    google-drive/       # Creates docs from templates in Google Drive
    google-calendar/    # Creates calendar events with attendee invites
  migrations/     # SQL schema + seed data (run these to set up your DB)
scripts/
  generate-hash.mjs   # CLI tool for generating the portal password hash
  google-auth.mjs     # CLI tool for Google OAuth2 authorization
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

4. **Financial data**: Replace `src/data/financials.js` with your organization's 990 filing data (or remove the financial charts from the Dashboard if you don't need them).

5. **FAQ content**: Update the questions and answers in `src/pages/FAQ.jsx` to match your organization's context.

6. **Logo and name**: Replace references to "Akron Children's Museum" in the Layout component and anywhere else they appear.

The password gate, meeting/document/proposal workflows, and auto-update system all work out of the box regardless of the organization.

## Why We Built This

Nonprofit boards run on volunteer time. Every minute a board member spends hunting for a meeting agenda in their email or asking "where's the latest budget?" is a minute not spent on the mission.

We built this because the existing tools (email threads, shared Google Drive folders, group texts) stopped scaling as the board grew. The portal doesn't replace those tools — it organizes them into one place so nothing gets lost.

If your board is in the same boat, please take this and make it your own. Nonprofit technology shouldn't be a luxury.

## Contributing

Found a bug? Have an idea? Open an issue or submit a pull request. This is a community project and contributions are welcome.

## License

MIT — use it however you'd like, no strings attached.
