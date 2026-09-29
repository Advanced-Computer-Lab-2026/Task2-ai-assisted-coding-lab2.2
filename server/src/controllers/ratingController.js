import { Rating } from "../models/Rating.js";

// GET /api/ratings
export async function getAllRatings(req, res, next) {
  try {
    const ratings = await Rating.find();
    res.json({ ratings });
  } catch (err) {
    next(err);
  }
}

// GET /api/ratings/:id
export async function getRating(req, res, next) {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) {
      return res.status(404).json({ message: "Rating not found" });
    }
    res.json({ rating });
  } catch (err) {
    next(err);
  }
}

// POST /api/ratings
export async function createRating(req, res, next) {
  try {
    const { movieCode, rating, note, ratedBy } = req.body;
    const created = await Rating.create({ movieCode, rating, note, ratedBy });
    res.status(201).json({ rating: created });
  } catch (err) {
    next(err);
  }
}

// GET /api/ratings/summary?movieCode=...
export async function getRatingSummary(req, res, next) {
  try {
    const { movieCode } = req.query;
    if (!movieCode) {
      return res.status(400).json({ message: "movieCode is required" });
    }
    const [summary] = await Rating.aggregate([
      { $match: { movieCode } },
      { $group: { _id: null, averageRating: { $avg: "$rating" }, ratingCount: { $sum: 1 } } },
    ]);
    res.json({
      movieCode,
      averageRating: summary?.averageRating ?? 0,
      ratingCount: summary?.ratingCount ?? 0,
    });
  } catch (err) {
    next(err);
  }
}
