// routes/adminAuth.js
import express from "express";
import admin from "../firebase-admin-server/firebaseAdmin.js"; // pastikan sudah inisialisasi firebase-admin

const router = express.Router();

// Tambahkan role admin ke user
router.post("/set-admin", async (req, res) => {
  const { uid } = req.body;
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    res.json({ success: true, message: "User sekarang adalah admin." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
