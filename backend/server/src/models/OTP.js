import mongoose from 'mongoose';

const OTPSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user ID'],
    },
    code: {
      type: String,
      required: [true, 'Please provide an OTP code'],
    },
    expiresAt: {
      type: Date,
      required: [true, 'Please provide an expiration time'],
    },
  },
  { timestamps: true }
);

// Indexes
OTPSchema.index({ userId: 1 });
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired OTPs

export default mongoose.model('OTP', OTPSchema);
