import express from 'express';
import * as ratingController from '../controllers/ratingController.js';

const router = express.Router();

// Summary endpoint must be before /:id
router.get('/summary', ratingController.getRatingSummary);

router.get('/', ratingController.getAllRatings);
router.post('/', ratingController.createRating);
router.get('/:id', ratingController.getRating);

export default router;
