/**
 * Check Users Script
 * Run: node scripts/checkUsers.js
 * Lists all users in the DB so you can see what accounts exist.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI;

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', userSchema);

const run = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to:', MONGO_URI.split('@')[1]?.split('/')[0] || 'DB');

    const users = await User.find({}, { password: 0 }); // Exclude password hash

    if (users.length === 0) {
      console.log('\n⚠️  NO USERS FOUND in the database.');
      console.log('   → You need to Register a new account from the app (Sign Up tab).');
      console.log('   → After registering, run: node scripts/makeAdmin.js your@email.com');
    } else {
      console.log(`\n✅ Found ${users.length} user(s):\n`);
      users.forEach((u, i) => {
        console.log(`  [${i + 1}] Name:    ${u.name}`);
        console.log(`       Email:   ${u.email}`);
        console.log(`       ID:      ${u._id}`);
        console.log(`       isAdmin: ${u.isAdmin}`);
        console.log(`       Created: ${u.createdAt}`);
        console.log('');
      });
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected.');
    process.exit(0);
  }
};

run();
