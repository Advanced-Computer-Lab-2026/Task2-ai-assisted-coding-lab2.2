import mongoose from 'mongoose';
import { Rating } from '../models/Rating.js';

/**
 * POST /api/ratings
 * Creates a new rating document
 */
export const createRating = async (req, res, next) => {
  try {
    const { movieCode, rating, note, ratedBy } = req.body;

    const newRating = await Rating.create({
      movieCode,
      rating,
      note,
      ratedBy
    });

    return res.status(201).json({ rating: newRating });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/ratings
 * Retrieves all ratings
 */
export const getAllRatings = async (req, res, next) => {
  try {
    const ratings = await Rating.find();
    return res.status(200).json({ ratings });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/ratings/:id
 * Retrieves a single rating by ID
 */
export const getRating = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    const rating = await Rating.findById(id);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    return res.status(200).json({ rating });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/ratings/summary?movieCode=MV101
 * Aggregates averageRating and ratingCount for a given movieCode
 */
export const getRatingSummary = async (req, res, next) => {
  try {
    const { movieCode } = req.query;

    if (!movieCode) {
      return res.status(400).json({ message: 'movieCode is required' });
    }

    const result = await Rating.aggregate([
      {
        $match: { movieCode: movieCode }
      },
      {
        $group: {
          _id: '$movieCode',
          averageRating: { $avg: '$rating' },
          ratingCount: { $sum: 1 }
        }
      }
    ]);

    if (!result || result.length === 0) {
      return res.status(200).json({
        movieCode,
        averageRating: 0,
        ratingCount: 0
      });
    }

    return res.status(200).json({
      movieCode,
      averageRating: result[0].averageRating,
      ratingCount: result[0].ratingCount
    });
  } catch (err) {
    next(err);
  }
};