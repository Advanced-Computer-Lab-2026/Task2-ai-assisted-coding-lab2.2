import { Rating } from '../models/Rating.js';

// GET /api/ratings
// Returns all ratings: 200 { ratings: [...] }
export async function getAllRatings(req, res, next) {
  try {
    const ratings = await Rating.find();
    res.status(200).json({ ratings });
  } catch (err) {
    next(err);
  }
}

// GET /api/ratings/:id
// Returns single rating: 200 { rating: <document> }
// If not found: 404 { message: 'Rating not found' }
export async function getRating(req, res, next) {
  try {
    const { id } = req.params;
    const rating = await Rating.findById(id);

    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    res.status(200).json({ rating });
  } catch (err) {
    next(err);
  }
}

// POST /api/ratings
// Creates a rating: 201 { rating: <document> }
export async function createRating(req, res, next) {
  try {
    const { movieCode, rating, note, ratedBy } = req.body;

    const newRating = await Rating.create({
      movieCode,
      rating,
      note,
      ratedBy,
    });

    res.status(201).json({ rating: newRating });
  } catch (err) {
    next(err);
  }
}

// GET /api/ratings/summary?movieCode=MV101
// Returns summary: { movieCode: "MV101", averageRating: <number>, ratingCount: <integer> }
// If missing query param: 400 { message: 'movieCode is required' }
// If no ratings match: 200 { movieCode: "...", averageRating: 0, ratingCount: 0 }
export async function getRatingSummary(req, res, next) {
  try {
    const { movieCode } = req.query;

    if (!movieCode) {
      return res.status(400).json({ message: 'movieCode is required' });
    }

    const summary = await Rating.aggregate([
      {
        $match: { movieCode: movieCode },
      },
      {
        $group: {
          _id: '$movieCode',
          averageRating: { $avg: '$rating' },
          ratingCount: { $sum: 1 },
        },
      },
    ]);

    if (summary.length === 0) {
      return res.status(200).json({
        movieCode,
        averageRating: 0,
        ratingCount: 0,
      });
    }

    res.status(200).json({
      movieCode: summary[0]._id,
      averageRating: summary[0].averageRating,
      ratingCount: summary[0].ratingCount,
    });
  } catch (err) {
    next(err);
  }
}