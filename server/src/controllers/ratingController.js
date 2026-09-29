import { Rating } from '../models/Rating.js';
import Joi from 'joi';

const createSchema = Joi.object({
  movieCode: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  note: Joi.string(),
  ratedBy: Joi.string().hex().length(24)
});

export async function getAllRatings(req, res, next) {
  try {
    const ratings = await Rating.find();
    res.json({ ratings });
  } catch (err) { next(err); }
}

export async function getRating(req, res, next) {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) return res.status(404).json({ message: 'Rating not found' });
    res.json({ rating });
  } catch (err) { next(err); }
}

export async function createRating(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) return res.status(400).json({ message: error.message });

    const rating = await Rating.create(value);
    res.status(201).json({ rating });
  } catch (err) { next(err); }
}

export async function getRatingSummary(req, res, next) {
  try {
    const { movieCode } = req.query;
    if (!movieCode) return res.status(400).json({ message: 'movieCode is required' });

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
      averageRating: summary?.averageRating ?? 0,
      ratingCount: summary?.ratingCount ?? 0
    });
  } catch (err) { next(err); }
}
