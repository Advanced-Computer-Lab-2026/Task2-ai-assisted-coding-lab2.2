import express from 'express';
import {
  createRating,
  getAllRatings,
  getRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = express.Router();

router.get('/summary', getRatingSummary);
router.get('/', getAllRatings);
router.post('/', createRating);
router.get('/:id', getRating);

export default router;
