import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    compatibilityScore: {
      type: Number, // percentage or score (0–100)
      required: true,
    },
    commonSubjects: [String], // store overlap for faster retrieval
    commonGoals: [String],
    studyPreferenceMatch: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Ensure same pair isn't stored twice (unique compound index)
matchSchema.index({ users: 1 }, { unique: true });

export default mongoose.model('Match', matchSchema);
