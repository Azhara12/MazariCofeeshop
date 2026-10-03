/**
 * Seed Admin User Script
 * Creates a fresh admin account directly in MongoDB.
 *
 * Usage:
 *   node scripts/seedAdmin.js <name> <email> <password>
 *
 * Example:
 *   node scripts/seedAdmin.js "Azhar Mahmood" azharmahmoodmazari@gmail.com mypassword123
 */
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']); // Fix MongoDB Atlas DNS resolution on Windows

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const [,, name, email, password] = process.argv;

if (!name || !email || !password) {
  console.error('❌ Usage: node scripts/seedAdmin.js "<name>" <email> <password>');
  process.exit(1);
}

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin:  { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

const run = async () => {
  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected!\n');

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`⚠️  User with email "${email}" already exists.`);
      console.log('   Making them admin...');
      existing.isAdmin = true;
      await existing.save();
      console.log(`✅ "${existing.name}" is now an Admin.`);
      return;
    }

    // Hash password manually (bypassing pre-save hook since we define schema here)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: true,
    });

    console.log('✅ Admin user created successfully!\n');
    console.log('   Name:    ', user.name);
    console.log('   Email:   ', user.email);
    console.log('   ID:      ', user._id);
    console.log('   isAdmin: ', user.isAdmin);
    console.log('\n🎉 You can now log in with:');
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${password}`);
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected. Done.');
    process.exit(0);
  }
};

run();
