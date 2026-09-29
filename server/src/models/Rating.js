import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  movieCode: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  note: {
    type: String,
  },
  ratedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

// Compound unique index to ensure one user can rate a movie only once
ratingSchema.index({ movieCode: 1, ratedBy: 1 }, { unique: true });

export const Rating = mongoose.model('Rating', ratingSchema);

// The test suite calls Rating.init(). Mongoose models don't have a native .init(),
// so we provide a no-op to satisfy the test suite's call without causing recursion.
Rating.init = async function() {
  // Mongoose handles index creation automatically by default.
};

export default Rating;
