import { Router } from 'express';
import {
  createRating,
  getAllRatings,
  getRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = Router();

router.post('/', createRating);
router.get('/', getAllRatings);
router.get('/summary', getRatingSummary); // must stay above '/:id'
router.get('/:id', getRating);

export default router;