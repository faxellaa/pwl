// setAdmin.js
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

// Ganti UID di bawah ini dengan UID user Firebase yang akan jadi admin
const uid = "KptNKzmyBkTg8nWKQzR4hijc7wf2";

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`User ${uid} sekarang adalah admin.`);
  })
  .catch((error) => {
    console.error("Gagal menetapkan admin:", error);
  });
