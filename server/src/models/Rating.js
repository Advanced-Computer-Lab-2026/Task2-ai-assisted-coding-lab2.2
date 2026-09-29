import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
  {
    movieCode: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    note: { type: String },
    ratedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// One rating per user per movie. The partial filter keeps anonymous
// ratings (no ratedBy) from colliding with each other.
ratingSchema.index(
  { movieCode: 1, ratedBy: 1 },
  { unique: true, partialFilterExpression: { ratedBy: { $type: 'objectId' } } }
);

export default mongoose.model('Rating', ratingSchema);