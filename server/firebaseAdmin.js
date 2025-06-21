import admin from "firebase-admin";
import fs from "fs";

// Baca file JSON key menggunakan fs dan URL di ESM
const serviceAccount = JSON.parse(
  fs.readFileSync(new URL("./web-pelaporan-firebase-adminsdk-fbsvc-1bfc7e0510.json", import.meta.url))
);

// Inisialisasi Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
