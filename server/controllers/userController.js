const User = require('../models/userModel');

// GET /api/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data pengguna' });
  }
};

module.exports = { getAllUsers };
