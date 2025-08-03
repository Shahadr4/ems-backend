// userseed.js
import bcrypt from 'bcryptjs';
import User from './models/User.js';

const seedUsers = async () => {
  try {
    const existing = await User.findOne({ email: "admin@gmail.com" });
    if (existing) {
      console.log("⚠️ Admin user already exists.");
      return;
    }

    const hashPassword = await bcrypt.hash("admin", 10);
    const newUser = new User({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashPassword,
      role: "admin"
    });

    await newUser.save();
    console.log("✅ Admin user seeded successfully.");
  } catch (err) {
    console.error("❌ Seeding error:", err.message);
  }
};

export default seedUsers;
