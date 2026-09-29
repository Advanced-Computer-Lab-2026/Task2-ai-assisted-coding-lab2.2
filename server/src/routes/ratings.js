import express from 'express';
import {
  getAllRatings,
  getRating,
  createRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = express.Router();

// Summary endpoint must be before /:id to avoid collision
router.get('/summary', getRatingSummary);
router.get('/', getAllRatings);
router.get('/:id', getRating);
router.post('/', createRating);

export default router;
