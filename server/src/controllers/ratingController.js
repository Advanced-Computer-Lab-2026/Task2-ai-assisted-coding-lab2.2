import Joi from 'joi';
import mongoose from 'mongoose';
import { Rating } from '../models/Rating.js';

const ratingSchema = Joi.object({
  movieCode: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  note: Joi.string().allow(''),
  ratedBy: Joi.string().hex().length(24).optional()
});

// POST /api/ratings
export async function createRating(req, res, next) {
  try {
    const { value, error } = ratingSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const rating = await Rating.create(value);
    res.status(201).json({ rating });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'You already rated this movie' });
    }
    next(err);
  }
}

// GET /api/ratings
export async function getAllRatings(req, res, next) {
  try {
    const ratings = await Rating.find().sort({ createdAt: -1 }).lean();
    res.json({ ratings });
  } catch (err) { next(err); }
}

// GET /api/ratings/summary
export async function getRatingSummary(req, res, next) {
  try {
    const { movieCode } = req.query;
    if (!movieCode) return res.status(400).json({ message: 'movieCode is required' });

    const result = await Rating.aggregate([
      { $match: { movieCode } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          ratingCount: { $sum: 1 }
        }
      }
    ]);

    if (result.length === 0) {
      return res.json({ movieCode, averageRating: 0, ratingCount: 0 });
    }

    const { averageRating, ratingCount } = result[0];
    res.json({ movieCode, averageRating, ratingCount });
  } catch (err) { next(err); }
}

// GET /api/ratings/:id
export async function getRating(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid rating id' });
    }

    const rating = await Rating.findById(id);
    if (!rating) return res.status(404).json({ message: 'Rating not found' });

    res.json({ rating });
  } catch (err) { next(err); }
}
