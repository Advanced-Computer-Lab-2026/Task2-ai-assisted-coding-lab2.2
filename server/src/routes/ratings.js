import { Router } from 'express';
// import {
//   getAllRatings,
//   getRating,
//   createRating,
//   getRatingSummary
// } from '../controllers/ratingController.js';

// const router = Router();

// // TODO: wire up the three routes in README.md section 2 and the summary route in section 3.

// export default router;


import express from 'express';
import {
  createRating,
  getAllRatings,
  getRating,
  getRatingSummary,
} from '../controllers/ratingController.js';

const router = express.Router();

// Register the summary route BEFORE the parameterized /:id route
router.get('/summary', getRatingSummary);

router.post('/', createRating);
router.get('/', getAllRatings);
router.get('/:id', getRating);

export default router;