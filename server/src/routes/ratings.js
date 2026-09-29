import express from 'express';
import * as ratingController from '../controllers/ratingController.js';

const router = express.Router();

// Summary must come BEFORE :id
router.get('/summary', ratingController.getRatingSummary);
router.get('/', ratingController.getAllRatings);
router.get('/:id', ratingController.getRating);
router.post('/', ratingController.createRating);

export default router;
