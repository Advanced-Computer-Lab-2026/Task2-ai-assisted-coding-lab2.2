import express from 'express';
import {
  createRating,
  getAllRatings,
  getRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = express.Router();

router.route('/')
  .get(getAllRatings)
  .post(createRating);

router.get('/summary', getRatingSummary);
router.get('/:id', getRating);

export default router;
