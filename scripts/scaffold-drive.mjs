#!/usr/bin/env node

/**
 * Google Drive Folder Scaffold
 *
 * Creates the full meeting folder structure inside a Google Drive folder,
 * including template documents for board and committee meetings.
 *
 * Usage:
 *   node scripts/scaffold-drive.mjs
 *
 * Prerequisites:
 *   1. Run `node scripts/google-auth.mjs` first to get your OAuth tokens
 *   2. Set the following Supabase secrets (from google-auth output):
 *      - GOOGLE_CLIENT_ID
 *      - GOOGLE_CLIENT_SECRET
 *      - GOOGLE_REFRESH_TOKEN
 *
 * What it creates:
 *   <root>/
 *     Board Meetings/
 *       [Template] Board Meeting Agenda        (Google Doc)
 *       [Template] Board Meeting Minutes        (Google Doc)
 *     Committee Meetings/
 *       Development Committee Meetings/
 *       Executive Committee Meetings/
 *       Finance Committee Meetings/
 *       Governance Committee Meetings/
 *       [Template] Committee Meeting Agenda     (Google Doc)
 *       [Template] Committee Meeting Minutes    (Google Doc)
 *
 * After running, it outputs the `supabase secrets set` commands for all
 * the folder and template IDs.
 */

import { createInterface } from 'readline';

const rl = createInterface({ input: process.stdin, output: process.stderr });

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

// ── Google API helpers ──

async function getAccessToken(clientId, clientSecret, refreshToken) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Token refresh failed: ${response.status} ${body}`);
  }

  const tokens = await response.json();
  return tokens.access_token;
}

async function createFolder(accessToken, name, parentId) {
  const response = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Folder creation failed for "${name}": ${response.status} ${body}`);
  }

  const folder = await response.json();
  return { id: folder.id, name };
}

async function createDoc(accessToken, name, parentId, bodyContent = '') {
  // Create a blank Google Doc
  const response = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      mimeType: 'application/vnd.google-apps.document',
      parents: [parentId],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Doc creation failed for "${name}": ${response.status} ${body}`);
  }

  const file = await response.json();

  // Add template content if provided
  if (bodyContent) {
    await fetch(`https://docs.googleapis.com/v1/documents/${file.id}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: bodyContent,
            },
          },
        ],
      }),
    });
  }

  return { id: file.id, name };
}

/**
 * Extract a Google Drive folder ID from a URL or bare ID.
 */
function parseFolderId(input) {
  const trimmed = input.trim();

  // Full URL: https://drive.google.com/drive/u/0/folders/XXXXX or /drive/folders/XXXXX
  const urlMatch = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (urlMatch) return urlMatch[1];

  // Bare ID (no slashes, looks like an ID)
  if (/^[a-zA-Z0-9_-]{10,}$/.test(trimmed)) return trimmed;

  return null;
}

// ── Default committee list (customizable) ──

const DEFAULT_COMMITTEES = [
  'Development',
  'Executive',
  'Finance',
  'Governance',
];

// ── Template content ──

const BOARD_AGENDA_CONTENT = `[Date] Board Meeting Agenda

OUR MISSION
To be a vibrant gathering place for all ages, where play inspires exploration, discovery, and problem solving.

OUR VISION
ACM envisions a community shaped by lifelong learners, who provide innovative leadership inspired by creativity and diverse perspectives.

1. Prior Meeting Minutes
2. President's Report
3. Treasurer's Report
4. Executive Director's Report
5. Committee Reports
   a. Finance
   b. Governance
   c. Development
6. Old Business
7. New Business
8. Adjourn
`;

const BOARD_MINUTES_CONTENT = `[Date] Board Meeting Minutes

Attendees:


1. President's Report
2. Treasurer's Report
3. Executive Director's Report
4. Committee Reports
   a. Finance
   b. Governance
   c. Development
5. Old Business
6. New Business
7. Adjourn
`;

const COMMITTEE_AGENDA_CONTENT = `[Date] [Committee] Committee Meeting Agenda

OUR MISSION
To be a vibrant gathering place for all ages, where play inspires exploration, discovery, and problem solving.

OUR VISION
ACM envisions a community shaped by lifelong learners, who provide innovative leadership inspired by creativity and diverse perspectives.

1. Old Business
2. New Business
3. Adjourn
`;

const COMMITTEE_MINUTES_CONTENT = `[Date] [Committee] Committee Meeting Minutes

Attendees:


1. Old Business
2. New Business
3. Adjourn
`;

const GENERIC_AGENDA_CONTENT = `[Date] Meeting Agenda

OUR MISSION
To be a vibrant gathering place for all ages, where play inspires exploration, discovery, and problem solving.

OUR VISION
ACM envisions a community shaped by lifelong learners, who provide innovative leadership inspired by creativity and diverse perspectives.

1. Old Business
2. New Business
3. Adjourn
`;

const GENERIC_MINUTES_CONTENT = `[Date] Meeting Minutes

Attendees:


1. Old Business
2. New Business
3. Adjourn
`;

// ── Main ──

console.error('');
console.error('╔══════════════════════════════════════════════════════╗');
console.error('║    Board Portal — Drive Folder Scaffold Setup       ║');
console.error('╚══════════════════════════════════════════════════════╝');
console.error('');
console.error('This creates the full meeting folder structure in your');
console.error('Google Drive, including template documents.');
console.error('');

const clientId = await ask('Google Client ID: ');
const clientSecret = await ask('Google Client Secret: ');
const refreshToken = await ask('Google Refresh Token: ');
console.error('');

const folderInput = await ask('Root Google Drive folder (URL or ID): ');
const rootFolderId = parseFolderId(folderInput);

if (!rootFolderId) {
  console.error('\nCould not parse a folder ID from that input.');
  console.error('Paste a URL like: https://drive.google.com/drive/folders/XXXXX');
  rl.close();
  process.exit(1);
}

// Ask about committees
console.error('');
console.error(`Default committees: ${DEFAULT_COMMITTEES.join(', ')}`);
const customCommittees = await ask('Committees (comma-separated, or press Enter to use defaults): ');
rl.close();

const committees = customCommittees.trim()
  ? customCommittees.split(',').map(c => c.trim()).filter(Boolean)
  : DEFAULT_COMMITTEES;

console.error('');
console.error('Getting access token...');

const accessToken = await getAccessToken(clientId.trim(), clientSecret.trim(), refreshToken.trim());

console.error('Creating folder structure...');
console.error('');

// ── Create Board Meetings folder + templates ──

const boardFolder = await createFolder(accessToken, 'Board Meetings', rootFolderId);
console.error(`  ✓ Board Meetings folder`);

const boardAgenda = await createDoc(
  accessToken,
  '[Template] Board Meeting Agenda',
  boardFolder.id,
  BOARD_AGENDA_CONTENT
);
console.error(`  ✓ Board Meeting Agenda template`);

const boardMinutes = await createDoc(
  accessToken,
  '[Template] Board Meeting Minutes',
  boardFolder.id,
  BOARD_MINUTES_CONTENT
);
console.error(`  ✓ Board Meeting Minutes template`);

// ── Create Committee Meetings folder + templates + subfolders ──

const committeeFolder = await createFolder(accessToken, 'Committee Meetings', rootFolderId);
console.error(`  ✓ Committee Meetings folder`);

const committeeFolderMap = {};

for (const name of committees) {
  const sub = await createFolder(accessToken, `${name} Committee Meetings`, committeeFolder.id);
  committeeFolderMap[name] = sub.id;
  console.error(`    ✓ ${name} Committee Meetings subfolder`);
}

const committeeAgenda = await createDoc(
  accessToken,
  '[Template] Committee Meeting Agenda',
  committeeFolder.id,
  COMMITTEE_AGENDA_CONTENT
);
console.error(`  ✓ Committee Meeting Agenda template`);

const committeeMinutes = await createDoc(
  accessToken,
  '[Template] Committee Meeting Minutes',
  committeeFolder.id,
  COMMITTEE_MINUTES_CONTENT
);
console.error(`  ✓ Committee Meeting Minutes template`);

// ── Create Generic templates in root folder ──

const genericAgenda = await createDoc(
  accessToken,
  '[Template] Generic Meeting Agenda',
  rootFolderId,
  GENERIC_AGENDA_CONTENT
);
console.error(`  ✓ Generic Meeting Agenda template`);

const genericMinutes = await createDoc(
  accessToken,
  '[Template] Generic Meeting Minutes',
  rootFolderId,
  GENERIC_MINUTES_CONTENT
);
console.error(`  ✓ Generic Meeting Minutes template`);

// ── Output the Supabase secrets commands ──

console.error('');
console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.error('  Scaffold complete! Run these to set your secrets:');
console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.error('');

console.log(`supabase secrets set GOOGLE_ROOT_FOLDER_ID='${rootFolderId}'`);
console.log(`supabase secrets set GOOGLE_BOARD_FOLDER_ID='${boardFolder.id}'`);
console.log(`supabase secrets set GOOGLE_BOARD_AGENDA_TEMPLATE_ID='${boardAgenda.id}'`);
console.log(`supabase secrets set GOOGLE_BOARD_MINUTES_TEMPLATE_ID='${boardMinutes.id}'`);
console.log(`supabase secrets set GOOGLE_COMMITTEE_FOLDER_ID='${committeeFolder.id}'`);
console.log(`supabase secrets set GOOGLE_COMMITTEE_AGENDA_TEMPLATE_ID='${committeeAgenda.id}'`);
console.log(`supabase secrets set GOOGLE_COMMITTEE_MINUTES_TEMPLATE_ID='${committeeMinutes.id}'`);
console.log(`supabase secrets set GOOGLE_COMMITTEE_FOLDER_MAP='${JSON.stringify(committeeFolderMap)}'`);
console.log(`supabase secrets set GOOGLE_GENERIC_AGENDA_TEMPLATE_ID='${genericAgenda.id}'`);
console.log(`supabase secrets set GOOGLE_GENERIC_MINUTES_TEMPLATE_ID='${genericMinutes.id}'`);

console.error('');
console.error('The templates contain placeholder text — customize them');
console.error('in Google Docs with your logo, formatting, and branding.');
console.error('');
console.error('Template docs:');
console.error(`  Board Agenda:      https://docs.google.com/document/d/${boardAgenda.id}/edit`);
console.error(`  Board Minutes:     https://docs.google.com/document/d/${boardMinutes.id}/edit`);
console.error(`  Committee Agenda:  https://docs.google.com/document/d/${committeeAgenda.id}/edit`);
console.error(`  Committee Minutes: https://docs.google.com/document/d/${committeeMinutes.id}/edit`);
console.error(`  Generic Agenda:    https://docs.google.com/document/d/${genericAgenda.id}/edit`);
console.error(`  Generic Minutes:   https://docs.google.com/document/d/${genericMinutes.id}/edit`);
console.error('');
