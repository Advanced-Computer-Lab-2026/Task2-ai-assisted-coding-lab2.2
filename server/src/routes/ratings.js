import { Router } from 'express';
import {
  createRating,
  getAllRatings,
  getRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = Router();

// Summary route must be defined before /:id
router.get('/summary', getRatingSummary);

router.get('/', getAllRatings);
router.post('/', createRating);
router.get('/:id', getRating);

export default router;
