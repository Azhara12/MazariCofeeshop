/**
 * Admin Seeder Script
 * Run with: node scripts/makeAdmin.js <email>
 * Example:  node scripts/makeAdmin.js azharmahmoodmazari@gmail.com
 */
import mongoose from 'mongoose';

const MONGO_URI = 'mongodb+srv://MazariCs:azhar123@cluster0.zdacyxl.mongodb.net/mazarics?retryWrites=true&w=majority';

const email = process.argv[2];

if (!email) {
  console.error('❌  Please provide an email address.');
  console.error('Usage: node scripts/makeAdmin.js <email>');
  process.exit(1);
}

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', userSchema);

const run = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected.');

    const result = await User.findOneAndUpdate(
      { email },
      { $set: { isAdmin: true } },
      { new: true }
    );

    if (!result) {
      console.error(`❌ No user found with email: ${email}`);
    } else {
      console.log(`✅ SUCCESS! "${result.name || email}" is now an Admin.`);
      console.log('   isAdmin:', result.isAdmin);
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected. Done.');
    process.exit(0);
  }
};

run();
