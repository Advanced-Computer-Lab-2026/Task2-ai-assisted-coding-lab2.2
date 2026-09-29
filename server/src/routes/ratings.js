import { Router } from 'express';
import {
  getAllRatings,
  getRating,
  createRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = Router();

// Summary route must come before /:id
router.get('/summary', getRatingSummary);

router.get('/', getAllRatings);
router.get('/:id', getRating);
router.post('/', createRating);

export default router;
