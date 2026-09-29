import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
  {
    movieCode: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    note: { type: String },
    ratedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

// One rating per user per movie. The partial filter lets anonymous ratings
// (no ratedBy) coexist instead of colliding on a null key.
ratingSchema.index(
  { movieCode: 1, ratedBy: 1 },
  { unique: true, partialFilterExpression: { ratedBy: { $exists: true } } }
);

export const Rating = mongoose.model('Rating', ratingSchema);
