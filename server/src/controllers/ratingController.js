import { Rating } from '../models/Rating.js';
import joi from 'joi';

const createSchema = joi.object({
  movieCode: joi.string().required(),
  rating: joi.number().integer().min(1).max(5).required(),
  note: joi.string().optional()
});

const updateSchema = joi.object({
  rating: joi.number().integer().min(1).max(5).required(),
  note: joi.string().optional()
});

// GET /api/ratings
// TODO: implement per README.md section 2.
export async function getAllRatings(req, res, next) {
  try {
    const ratings = await Rating.find().sort({ createdAt: -1 }).lean();
    res.json(ratings);
  } catch (err) { next(err); }
}

// GET /api/ratings/:id
// TODO: implement per README.md section 2.
export async function getRating(req, res, next) {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) return res.status(404).json({ message: 'Rating not found' });
    res.json(rating);
  } catch (err) { next(err); }
}

// POST /api/ratings
// TODO: implement per README.md section 2.
export async function createRating(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const rating = await Rating.create({ ...value, ratedBy: req.user.id });
    res.status(201).json(rating);
  } catch (err) { next(err); }
}

// GET /api/ratings/summary?movieCode=MV101
// TODO: implement per README.md section 3.
export async function getRatingSummary(req, res, next) {
  try {
    const { movieCode } = req.params;
    if(!movieCode) return res.status(400).json({ message: 'Missing movieCode query parameter' });

    const summary = await Rating.aggregate([
      { $match: { movieCode } },
      {
        $group: {
          _id: '$movieCode',
          averageRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 }
        }
      }
    ]);

       if (summary.length === 0) {
      return res.status(200).json({
        movieCode,
        averageRating: 0,
        totalRatings: 0,
      });
    }

    res.status(200).json(summary[0]);
  } catch (err) { next(err); }
}
