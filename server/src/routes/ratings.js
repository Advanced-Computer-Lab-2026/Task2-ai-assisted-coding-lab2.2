import express from 'express';
import * as ratingController from '../controllers/ratingController.js';

const router = express.Router();

// Order is critical: summary must come before :id
router.get('/summary', ratingController.getRatingSummary);
router.get('/', ratingController.getAllRatings);
router.post('/', ratingController.createRating);
router.get('/:id', ratingController.getRating);

export default router;
