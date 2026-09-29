import { Router } from 'express';
import {
  getAllRatings,
  getRating,
  createRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = Router();

// 1. Standard endpoints
router.post('/', createRating);
router.get('/', getAllRatings);

// 2. Summary endpoint MUST be defined BEFORE /:id so Express doesn't match "summary" as an ID
router.get('/summary', getRatingSummary);

// 3. Dynamic ID endpoint MUST come last
router.get('/:id', getRating);

export default router;