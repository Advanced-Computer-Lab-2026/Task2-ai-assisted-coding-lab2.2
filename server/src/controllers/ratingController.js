import mongoose from 'mongoose';
import Rating from '../models/Rating.js';

export const createRating = async (req, res, next) => {
  try {
    const { movieCode, rating, note, ratedBy } = req.body;
    const created = await Rating.create({ movieCode, rating, note, ratedBy });
    res.status(201).json({ rating: created });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};

export const getAllRatings = async (req, res, next) => {
  try {
    const ratings = await Rating.find();
    res.status(200).json({ ratings });
  } catch (err) {
    next(err);
  }
};

export const getRating = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }
    const rating = await Rating.findById(id);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    res.status(200).json({ rating });
  } catch (err) {
    next(err);
  }
};

export const getRatingSummary = async (req, res, next) => {
  try {
    const { movieCode } = req.query;
    if (!movieCode || typeof movieCode !== 'string') {
      return res.status(400).json({ message: 'movieCode is required' });
    }

    const [result] = await Rating.aggregate([
      { $match: { movieCode } },
      {
        $group: {
          _id: '$movieCode',
          averageRating: { $avg: '$rating' },
          ratingCount: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      movieCode,
      averageRating: result ? result.averageRating : 0,
      ratingCount: result ? result.ratingCount : 0,
    });
  } catch (err) {
    next(err);
  }
};