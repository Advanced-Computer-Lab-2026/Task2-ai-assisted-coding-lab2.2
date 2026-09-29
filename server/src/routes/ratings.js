import { Router } from 'express';
import {
  getAllRatings,
  getRating,
  createRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = Router();

// Summary must come before :id to preventExpress from treating 'summary' as an ID
router.get('/summary', getRatingSummary);

router.route('/')
  .get(getAllRatings)
  .post(createRating);

router.get('/:id', getRating);

export default router;
