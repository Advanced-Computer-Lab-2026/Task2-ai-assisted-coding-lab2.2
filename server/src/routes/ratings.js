import express from 'express';
import {
  createRating,
  getAllRatings,
  getRatingSummary,
  getRating
} from '../controllers/ratingController.js';

const router = express.Router();

router.post('/', createRating);
router.get('/', getAllRatings);

// MUST be declared before /:id to prevent the 'summary' literal from being parsed as an ID parameter
router.get('/summary', getRatingSummary);
router.get('/:id', getRating);

export default router;