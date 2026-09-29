import { Router } from 'express';
import {
  createRating,
  getAllRatings,
  getRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = Router();

// Summary must come BEFORE /:id to avoid being caught by getRating
router.get('/summary', getRatingSummary);

router.route('/')
  .get(getAllRatings)
  .post(createRating);

router.route('/:id')
  .get(getRating);

export default router;
