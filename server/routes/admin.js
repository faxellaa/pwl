import express from "express";
import admin from "../firebaseAdmin.js";


const router = express.Router();

router.get("/firebase-users", async (req, res) => {
  try {
    const result = await admin.auth().listUsers(1000);
    const users = result.users.map(user => ({
      uid: user.uid,
      email: user.email,
      createdAt: user.metadata.creationTime,
      lastSignIn: user.metadata.lastSignInTime,
    }));
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data user", error: err.message });
  }
});

export default router;
