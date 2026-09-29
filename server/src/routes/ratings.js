import { Router } from 'express';
import {
  createRating,
  getAllRatings,
  getRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = Router();

router.get('/', getAllRatings);
router.get('/summary', getRatingSummary);
router.get('/:id', getRating);
router.post('/', createRating);

export default router;
