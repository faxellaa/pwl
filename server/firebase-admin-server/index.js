import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Inisialisasi Firebase Admin
const serviceAccount = JSON.parse(
  fs.readFileSync(new URL("./web-pelaporan-firebase-adminsdk-fbsvc-1bfc7e0510.json", import.meta.url))
);
// Inisialisasi Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
// === Route untuk ambil user Firebase ===
app.get("/api/admin/firebase-users", async (req, res) => {
  try {
    const listUsers = await admin.auth().listUsers();
    const users = listUsers.users.map((userRecord) => ({
      uid: userRecord.uid,
      email: userRecord.email,
      createdAt: userRecord.metadata.creationTime,
      lastSignIn: userRecord.metadata.lastSignInTime,
    }));
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal mengambil user" });
  }
});

// === Route untuk tambah user Firebase ===
app.post("/api/admin/firebase-users", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await admin.auth().createUser({ email, password });
    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// === Route untuk hapus user ===
app.delete("/api/admin/firebase-users/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    await admin.auth().deleteUser(uid);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
// === Route untuk set user sebagai admin ===
app.post("/api/admin/set-admin", async (req, res) => {
  const { uid } = req.body;
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    res.json({ success: true, message: `User ${uid} sekarang adalah admin.` });
  } catch (error) {
    console.error("Gagal menetapkan admin:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});
// === Route untuk cek apakah user adalah admin ===
app.get("/api/admin/check-admin/:uid", async (req, res) => {    
    const { uid } = req.params;
    try {
        const userRecord = await admin.auth().getUser(uid);
        const isAdmin = userRecord.customClaims && userRecord.customClaims.admin === true;
        res.json({ isAdmin });
    } catch (error) {
        console.error("Gagal mengecek admin:", error);
        res.status(500).json({ success: false, message: error.message });
    }
    });
  
app.listen(PORT, () => {
  console.log(`🚀 Firebase Admin API running at http://localhost:${PORT}`);
});
