import express from 'express';
import * as ratingController from '../controllers/ratingController.js';

const router = express.Router();

router.post('/', ratingController.createRating);
router.get('/', ratingController.getAllRatings);
router.get('/summary', ratingController.getRatingSummary);
router.get('/:id', ratingController.getRating);

export default router;
