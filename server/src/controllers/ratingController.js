import Joi from 'joi';
import mongoose from 'mongoose';
import { Rating } from '../models/Rating.js';

const createSchema = Joi.object({
  movieCode: Joi.string().trim().required(),
  rating: Joi.number().min(1).max(5).required(),
  note: Joi.string().allow('').optional(),
  ratedBy: Joi.string().pattern(/^[a-fA-F0-9]{24}$/).optional()
});

// GET /api/ratings
export async function getAllRatings(req, res, next) {
  try {
    const ratings = await Rating.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({ ratings });
  } catch (err) { next(err); }
}

// GET /api/ratings/:id
export async function getRating(req, res, next) {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) return res.status(404).json({ message: 'Rating not found' });
    res.status(200).json({ rating });
  } catch (err) { next(err); }
}

// POST /api/ratings
export async function createRating(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) return res.status(400).json({ message: error.message });

    const payload = {
      movieCode: value.movieCode,
      rating: value.rating,
      note: value.note,
      ...(value.ratedBy ? { ratedBy: new mongoose.Types.ObjectId(value.ratedBy) } : {})
    };

    const rating = await Rating.create(payload);
    res.status(201).json({ rating });
  } catch (err) { next(err); }
}

// GET /api/ratings/summary?movieCode=MV101
export async function getRatingSummary(req, res, next) {
  try {
    const { movieCode } = req.query;

    if (!movieCode) {
      return res.status(400).json({ message: 'movieCode is required' });
    }

    const [summary] = await Rating.aggregate([
      { $match: { movieCode } },
      {
        $group: {
          _id: '$movieCode',
          averageRating: { $avg: '$rating' },
          ratingCount: { $sum: 1 }
        }
      }
    ]);

    if (!summary) {
      return res.status(200).json({ movieCode, averageRating: 0, ratingCount: 0 });
    }

    return res.status(200).json({
      movieCode,
      averageRating: Number(summary.averageRating),
      ratingCount: summary.ratingCount
    });
  } catch (err) { next(err); }
}
