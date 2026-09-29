import mongoose from 'mongoose';

// TODO: define the Rating schema per README.md section 1.


const ratingSchema = new mongoose.Schema(
  {
    movieCode: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    note: { type: String, required: false },
    ratedBy: { type: mongoose.Schema.Types.ObjectId,
      ref: 'User',requiered: false},
     
    
  },
  { timestamps: true }
);
ratingSchema.index({ movieCode: 1, ratedBy: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);

// TODO: add the compound uniqueness constraint described in README.md section 1.

export const Rating = mongoose.model('Rating', ratingSchema);
