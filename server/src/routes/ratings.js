import { Router } from 'express';

import {
  getAllRatings,
  getRating,
  createRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = Router();

// IMPORTANT: /summary must be before /:id
router.get('/summary', getRatingSummary);

// GET /api/ratings
router.get('/', getAllRatings);

// POST /api/ratings
router.post('/', createRating);

// GET /api/ratings/:id
router.get('/:id', getRating);

export default router;