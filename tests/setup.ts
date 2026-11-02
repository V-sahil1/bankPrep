import fs from "node:fs";
import path from "node:path";

// Load .env for integration tests without adding a runtime dependency on dotenv.
const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z_]+)="?([^"]*)"?$/);
    if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2];
  }
}
