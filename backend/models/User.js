import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    savedAddresses: [
      {
        street: String,
        city: String,
        phone: String,
        isDefault: { type: Boolean, default: false },
      },
    ],
    // OTP-based password reset fields
    resetOtp: { type: String, default: null },
    resetOtpExpire: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt before saving
// NOTE: In Mongoose 9, async pre-hooks do NOT receive `next` — just return the promise.
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;