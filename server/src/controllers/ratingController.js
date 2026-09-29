import Joi from 'joi';
import { Rating } from '../models/Rating.js';

const createSchema = Joi.object({
  movieCode: Joi.string().trim().min(1).required(),
  rating: Joi.number().min(1).max(5).required(),
  note: Joi.string().allow('').optional(),
  ratedBy: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional()
});

// GET /api/ratings
export async function getAllRatings(req, res, next) {
  try {
    const ratings = await Rating.find().sort({ createdAt: -1 });
    res.json({ ratings });
  } catch (err) { next(err); }
}

// GET /api/ratings/:id
export async function getRating(req, res, next) {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) return res.status(404).json({ message: 'Rating not found' });
    res.json({ rating });
  } catch (err) { next(err); }
}

// POST /api/ratings
export async function createRating(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) return res.status(400).json({ message: error.message });

    const rating = await Rating.create({
      movieCode: value.movieCode,
      rating: value.rating,
      ...(value.note !== undefined ? { note: value.note } : {}),
      ...(value.ratedBy !== undefined ? { ratedBy: value.ratedBy } : {})
    });
    res.status(201).json({ rating });
  } catch (err) {
    // The compound unique index rejects a second rating from the same user.
    if (err?.code === 11000) return res.status(409).json({ message: 'Rating already exists for this movie and user' });
    next(err);
  }
}

// GET /api/ratings/summary?movieCode=MV101
export async function getRatingSummary(req, res, next) {
  try {
    const { movieCode } = req.query;
    if (typeof movieCode !== 'string' || movieCode.length === 0) {
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

    res.json({
      movieCode,
      averageRating: summary ? summary.averageRating : 0,
      ratingCount: summary ? summary.ratingCount : 0
    });
  } catch (err) { next(err); }
}
