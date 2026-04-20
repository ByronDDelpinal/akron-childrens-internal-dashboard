#!/usr/bin/env node

/**
 * Google OAuth2 Token Helper
 *
 * One-time script to authorize the portal with your Google account.
 * It walks you through the consent flow and outputs a refresh token
 * that you store as a Supabase secret.
 *
 * Usage:
 *   node scripts/google-auth.mjs
 *
 * Prerequisites:
 *   1. Create a Google Cloud project at https://console.cloud.google.com
 *   2. Enable the Google Drive API and Google Calendar API
 *   3. Create OAuth2 credentials (Desktop app type)
 *   4. Download the client ID and client secret
 *
 * The refresh token never expires unless you revoke it, so you only
 * need to run this once per Google account.
 */

import { createInterface } from 'readline';
import { createServer } from 'http';
import { URL } from 'url';

const SCOPES = [
  'https://www.googleapis.com/auth/drive.readonly',        // Read existing files (copy templates)
  'https://www.googleapis.com/auth/drive.file',            // Create & manage files the app creates (folders, docs)
  'https://www.googleapis.com/auth/calendar.events',       // Create & manage calendar events
];

const REDIRECT_PORT = 3333;
const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}/callback`;

const rl = createInterface({ input: process.stdin, output: process.stderr });

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function waitForAuthCode() {
  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url, `http://localhost:${REDIRECT_PORT}`);

      if (url.pathname === '/callback') {
        const code = url.searchParams.get('code');
        const error = url.searchParams.get('error');

        if (error) {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end('<h2>Authorization denied.</h2><p>You can close this tab.</p>');
          server.close();
          reject(new Error(`Authorization denied: ${error}`));
          return;
        }

        if (code) {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <html><body style="font-family: system-ui; max-width: 500px; margin: 80px auto; text-align: center;">
              <h2 style="color: #00A89D;">Authorization successful!</h2>
              <p style="color: #666;">You can close this tab and return to the terminal.</p>
            </body></html>
          `);
          server.close();
          resolve(code);
          return;
        }
      }

      res.writeHead(404);
      res.end();
    });

    server.listen(REDIRECT_PORT, () => {
      // Server is ready, waiting for callback
    });

    server.on('error', (err) => {
      reject(new Error(`Could not start local server on port ${REDIRECT_PORT}: ${err.message}`));
    });
  });
}

async function exchangeCodeForTokens(clientId, clientSecret, code) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Token exchange failed: ${response.status} ${body}`);
  }

  return response.json();
}

// ── Main ──

console.error('');
console.error('╔══════════════════════════════════════════════════════╗');
console.error('║       Board Portal — Google Authorization Setup     ║');
console.error('╚══════════════════════════════════════════════════════╝');
console.error('');
console.error('This will authorize the portal to create Google Drive');
console.error('documents and Google Calendar events on your behalf.');
console.error('');
console.error('You\'ll need your OAuth2 Client ID and Client Secret');
console.error('from the Google Cloud Console.');
console.error('');

const clientId = await ask('Client ID: ');
const clientSecret = await ask('Client Secret: ');
rl.close();

if (!clientId.trim() || !clientSecret.trim()) {
  console.error('\nClient ID and Secret are required.');
  process.exit(1);
}

// Build the consent URL
const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
authUrl.searchParams.set('client_id', clientId.trim());
authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('scope', SCOPES.join(' '));
authUrl.searchParams.set('access_type', 'offline');
authUrl.searchParams.set('prompt', 'consent'); // Force refresh token generation

console.error('');
console.error('Opening your browser for Google authorization...');
console.error('If it doesn\'t open automatically, visit this URL:');
console.error('');
console.error(authUrl.toString());
console.error('');

// Try to open the browser
const openCommand = process.platform === 'darwin' ? 'open'
  : process.platform === 'win32' ? 'start'
  : 'xdg-open';

try {
  const { exec } = await import('child_process');
  exec(`${openCommand} "${authUrl.toString()}"`);
} catch {
  // Browser open failed — user can copy the URL manually
}

console.error('Waiting for authorization...');
console.error('');

try {
  const code = await waitForAuthCode();
  const tokens = await exchangeCodeForTokens(clientId.trim(), clientSecret.trim(), code);

  if (!tokens.refresh_token) {
    console.error('WARNING: No refresh token received. This usually means you\'ve');
    console.error('already authorized this app before. Revoke access at');
    console.error('https://myaccount.google.com/permissions and try again.');
    process.exit(1);
  }

  console.error('');
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('  Authorization complete! Here are your credentials:');
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('');
  console.error('Run these commands to store them as Supabase secrets:');
  console.error('');
  console.log(`supabase secrets set GOOGLE_CLIENT_ID='${clientId.trim()}'`);
  console.log(`supabase secrets set GOOGLE_CLIENT_SECRET='${clientSecret.trim()}'`);
  console.log(`supabase secrets set GOOGLE_REFRESH_TOKEN='${tokens.refresh_token}'`);
  console.error('');
  console.error('You also need to set the Drive folder and template secrets.');
  console.error('Run `node scripts/scaffold-drive.mjs` to create the folder');
  console.error('structure automatically, or set them manually:');
  console.error('');
  console.log(`supabase secrets set GOOGLE_ROOT_FOLDER_ID='your-root-folder-id'`);
  console.log(`supabase secrets set GOOGLE_BOARD_FOLDER_ID='your-board-meetings-folder-id'`);
  console.log(`supabase secrets set GOOGLE_BOARD_AGENDA_TEMPLATE_ID='your-board-agenda-template-id'`);
  console.log(`supabase secrets set GOOGLE_BOARD_MINUTES_TEMPLATE_ID='your-board-minutes-template-id'`);
  console.log(`supabase secrets set GOOGLE_COMMITTEE_FOLDER_ID='your-committee-meetings-folder-id'`);
  console.log(`supabase secrets set GOOGLE_COMMITTEE_AGENDA_TEMPLATE_ID='your-committee-agenda-template-id'`);
  console.log(`supabase secrets set GOOGLE_COMMITTEE_MINUTES_TEMPLATE_ID='your-committee-minutes-template-id'`);
  console.log(`supabase secrets set GOOGLE_COMMITTEE_FOLDER_MAP='{"Executive":"id","Finance":"id","Governance":"id","Development":"id"}'`);
  console.log(`supabase secrets set GOOGLE_GENERIC_AGENDA_TEMPLATE_ID='your-generic-agenda-template-id'`);
  console.log(`supabase secrets set GOOGLE_GENERIC_MINUTES_TEMPLATE_ID='your-generic-minutes-template-id'`);
  console.log(`supabase secrets set GOOGLE_CALENDAR_ID='primary'`);
  console.error('');
  console.error('To find a Google Drive folder ID, open the folder in Drive');
  console.error('and copy the ID from the URL: drive.google.com/drive/folders/{ID}');
  console.error('');
  console.error('To find a Google Doc template ID, open the doc in Drive');
  console.error('and copy the ID from the URL: docs.google.com/document/d/{ID}/edit');
  console.error('');
  console.error('"primary" for GOOGLE_CALENDAR_ID uses your main calendar.');
  console.error('To use a specific calendar, find its ID in Google Calendar settings.');
  console.error('');

} catch (err) {
  console.error(`\nAuthorization failed: ${err.message}`);
  process.exit(1);
}
