import { Router } from 'express';
import {
  getAllRatings,
  getRating,
  createRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = Router();

// GET /api/ratings/summary?movieCode=...
router.get('/summary', getRatingSummary);

// GET /api/ratings
router.get('/', getAllRatings);

// GET /api/ratings/:id
router.get('/:id', getRating);

// POST /api/ratings
router.post('/', createRating);

export default router;
