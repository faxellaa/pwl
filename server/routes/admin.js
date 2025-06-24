import express from "express";
import admin from "../firebase-admin-server/firebaseAdmin.js";


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
// routes/admin.js
router.post("/firebase-users", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await admin.auth().createUser({ email, password });
    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
});
router.delete("/firebase-users/:uid", async (req, res) => {
  try {
    await admin.auth().deleteUser(req.params.uid);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
