import express from 'express';
import {
  getAllRatings,
  getRating,
  createRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = express.Router();

router.get('/', getAllRatings);
router.post('/', createRating);
router.get('/summary', getRatingSummary);
router.get('/:id', getRating);

export default router;
