import { Rating } from '../models/Rating.js';

// GET /api/ratings
// TODO: implement per README.md section 2.
export async function getAllRatings(req, res, next) {
  try {
    // TODO
    const ratings = await Rating.find();
    res.status(200).json({ ratings });
  } catch (err) { next(err); }
}

// GET /api/ratings/:id
// TODO: implement per README.md section 2.
export async function getRating(req, res, next) {
  try {
    // TODO
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid rating id' });
    }
    const rating = await Rating.findById(req.params.id);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    res.status(200).json({ rating });
  } catch (err) 
  { next(err); }
}

// POST /api/ratings
// TODO: implement per README.md section 2.
export async function createRating(req, res, next) {
  try {
    // TODO
     const { movieCode, rating, note, ratedBy } = req.body;

    if (!movieCode || typeof movieCode !== 'string') {
      return res.status(400).json({ message: 'movieCode is required' });
    }
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating not found. rating must be a number between 1 and 5' });
    }
    if (ratedBy !== undefined && !mongoose.isValidObjectId(ratedBy)) {
      return res.status(400).json({ message: 'ratedBy must be a valid id' });
    }

    const created = await Rating.create({ movieCode, rating, note, ratedBy });
    res.status(201).json({ rating: created });
  } catch (err) { next(err); }
}

// GET /api/ratings/summary?movieCode=MV101
// TODO: implement per README.md section 3.
export async function getRatingSummary(req, res, next) {
  try {
    // TODO
     const { movieCode } = req.query;
    if (!movieCode || typeof movieCode !== 'string') {
      return res.status(400).json({ message: 'movieCode is required' });
    }

    const [summary] = await Rating.aggregate([
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
      averageRating: summary ? summary.averageRating : 0,
      ratingCount: summary ? summary.ratingCount : 0,
    });
  } catch (err) { next(err); }
}
