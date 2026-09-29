import { Router } from 'express';
import {
  getAllRatings,
  getRating,
  createRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = Router();

// summary route must come before :id route to prevent "summary" being treated as an ID
router.get('/summary', getRatingSummary);
router.get('/', getAllRatings);
router.post('/', createRating);
router.get('/:id', getRating);

export default router;
