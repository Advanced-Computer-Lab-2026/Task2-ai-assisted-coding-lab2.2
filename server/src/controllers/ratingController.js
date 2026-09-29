import Joi from 'joi';
import mongoose from 'mongoose';
import { Rating } from '../models/Rating.js';

const objectId = Joi.string().hex().length(24);

const createSchema = Joi.object({
  movieCode: Joi.string().trim().min(1).max(40).required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  note: Joi.string().trim().max(500).allow(''),
  ratedBy: objectId
});

const summarySchema = Joi.object({
  movieCode: Joi.string().trim().min(1).required().messages({
    'any.required': 'movieCode is required',
    'string.empty': 'movieCode is required'
  })
});

// GET /api/ratings
export async function getAllRatings(req, res, next) {
  try {
    const ratings = await Rating.find().sort({ createdAt: -1 }).lean();
    res.json({ ratings });
  } catch (err) { next(err); }
}

// GET /api/ratings/:id
export async function getRating(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid rating id' });
    }

    const rating = await Rating.findById(req.params.id);
    if (!rating) return res.status(404).json({ message: 'Rating not found' });
    res.json({ rating });
  } catch (err) { next(err); }
}

// POST /api/ratings
export async function createRating(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(400).json({ message: error.message });

    const rating = await Rating.create(value);
    res.status(201).json({ rating });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: 'This user has already rated this movie' });
    }
    next(err);
  }
}

// GET /api/ratings/summary?movieCode=MV101
export async function getRatingSummary(req, res, next) {
  try {
    const { value, error } = summarySchema.validate({ movieCode: req.query.movieCode });
    if (error) return res.status(400).json({ message: error.message });

    const [summary] = await Rating.aggregate([
      { $match: { movieCode: value.movieCode } },
      { $group: { _id: '$movieCode', averageRating: { $avg: '$rating' }, ratingCount: { $sum: 1 } } }
    ]);

    res.json({
      movieCode: value.movieCode,
      averageRating: summary ? Math.round(summary.averageRating * 100) / 100 : 0,
      ratingCount: summary ? summary.ratingCount : 0
    });
  } catch (err) { next(err); }
}
