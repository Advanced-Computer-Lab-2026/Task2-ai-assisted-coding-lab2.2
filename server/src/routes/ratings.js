import { Router } from 'express';
import {
  getAllRatings,
  getRating,
  createRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = Router();

// Summary route (must precede /:id)
router.get('/summary', getRatingSummary);

// Standard CRUD routes
router.get('/', getAllRatings);
router.post('/', createRating);
router.get('/:id', getRating);

export default router;