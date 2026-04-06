import mongoose from 'mongoose';

const authSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    emailVerifiedAt: {
      type: Date,
      default: null,
    },
    emailVerificationTokenHash: {
      type: String,
      default: null,
    },
    emailVerificationExpiresAt: {
      type: Date,
      default: null,
    },
    verificationEmailLastSentAt: {
      type: Date,
      default: null,
    },
    verificationEmailResendCount: {
      type: Number,
      required: true,
      default: 0,
    },
    verificationEmailResendWindowStartedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export interface AuthDocument {
  _id: mongoose.Types.ObjectId;
  email: string;
  passwordHash: string;
  emailVerified: boolean;
  emailVerifiedAt: Date | null;
  emailVerificationTokenHash: string | null;
  emailVerificationExpiresAt: Date | null;
  verificationEmailLastSentAt: Date | null;
  verificationEmailResendCount: number;
  verificationEmailResendWindowStartedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export const AuthModel = mongoose.model<AuthDocument>('Account', authSchema);
