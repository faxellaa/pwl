// server/config/firebaseAdmin.js
import admin from "firebase-admin";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Support untuk __dirname di ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path ke file service account
const serviceAccountPath = path.join(__dirname, "../firebaseServiceAccount.json");

const serviceAccount = JSON.parse(
  await readFile(serviceAccountPath, "utf-8")
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
