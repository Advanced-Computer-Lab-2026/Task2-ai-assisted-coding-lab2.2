import express from 'express';
import {
  createRating,
  getAllRatings,
  getRating,
  getRatingSummary
} from '../controllers/ratingController.js';

const router = express.Router();

// Routes
router.get('/', getAllRatings);
router.get('/summary', getRatingSummary);
router.get('/:id', getRating);
router.post('/', createRating);

export default router;
