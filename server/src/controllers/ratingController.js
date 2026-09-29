import { Rating } from '../models/Rating.js';

// GET /api/ratings
// TODO: implement per README.md section 2.
export async function getAllRatings(req, res, next) {
  try {
    // TODO
    const allRatings = await Rating.find();
    res.json({ratings: allRatings});
  } catch (err) { next(err); }
}

// GET /api/ratings/:id
// TODO: implement per README.md section 2.
export async function getRating(req, res, next) {
  try {
    // TODO
    const rating = await Rating.findById(req.params.id);
    if(!rating) return res.status(404).json({message: "Rating not found"});
    res.json({rating: rating});
  } catch (err) { next(err); }
}

// POST /api/ratings
// TODO: implement per README.md section 2.
export async function createRating(req, res, next) {
  try {
    // TODO
    const rating = await Rating.create(req.body);
    return res.status(201).json({rating: rating});
  } catch (err) { next(err); }
}

// GET /api/ratings/summary?movieCode=MV101
// TODO: implement per README.md section 3.
export async function getRatingSummary(req, res, next) {
  try {
    // TODO
    const movieCode = req.query.movieCode;
    if(!movieCode) return res.status(400).json({ message: 'movieCode is required' });
    const result = await Rating.aggregate([  //aggregate returns an array
    {$match: { movieCode }},
    // Group all matched ratings into one group.
    {$group: {
      // _id: null groups all matched ratings together into one single group.
      _id: null,
      averageRating: {$avg: "$rating"},
      ratingCount: {$sum: 1}
    }}
  ]);

  /* result example
  result = [
  {
    _id: null,
    averageRating: 4,
    ratingCount: 3
  }
]; */

  if(result.length === 0) return res.json({movieCode, averageRating: 0, ratingCount: 0});
  return res.status(200).json({movieCode,averageRating: result[0].averageRating,ratingCount: result[0].ratingCount});

  } catch (err) { next(err); }
}
