import { Router } from 'express';
import {
  getAllRatings,
  getRating,
  createRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = Router();

router.get('/summary', getRatingSummary);

router.route('/')
  .get(getAllRatings)
  .post(createRating);

router.route('/:id')
  .get(getRating);

export default router;
