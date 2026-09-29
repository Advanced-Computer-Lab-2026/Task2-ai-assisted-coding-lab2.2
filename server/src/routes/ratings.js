import express from 'express';
import * as ratingController from '../controllers/ratingController.js';

const router = express.Router();

router.get('/summary', ratingController.getRatingSummary);
router.route('/')
  .get(ratingController.getAllRatings)
  .post(ratingController.createRating);

router.get('/:id', ratingController.getRating);

export default router;
