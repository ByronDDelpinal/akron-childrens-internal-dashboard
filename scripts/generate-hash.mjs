/**
 * Generate a bcrypt hash for the board portal password.
 *
 * Usage:
 *   node scripts/generate-hash.mjs
 *
 * It will prompt you for the password, then output the hash
 * you need to set as a Supabase secret.
 */

import { createInterface } from "readline";
import { createHash, randomBytes } from "crypto";

// Node.js doesn't have bcrypt built-in, so we use a pure-JS implementation
// via the scrypt-based approach. For simplicity, we'll install bcryptjs.
// If bcryptjs isn't installed, the script will tell you.

let bcrypt;
try {
  bcrypt = await import("bcryptjs");
} catch {
  console.error(
    "bcryptjs is not installed. Run:\n  npm install --save-dev bcryptjs\n"
  );
  process.exit(1);
}

const rl = createInterface({
  input: process.stdin,
  output: process.stderr, // prompt to stderr so stdout is clean for piping
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer));
  });
}

const password = await ask("Enter the board portal password: ");
rl.close();

if (!password.trim()) {
  console.error("Password cannot be empty.");
  process.exit(1);
}

const salt = bcrypt.default.genSaltSync(10);
const hash = bcrypt.default.hashSync(password, salt);

console.log("");
console.log("Your bcrypt hash (copy this entire string):");
console.log("");
console.log(hash);
console.log("");
console.log("Now set it as a Supabase secret by running:");
console.log("");
console.log(`  supabase secrets set BOARD_PASSWORD_HASH='${hash}'`);
console.log("");
