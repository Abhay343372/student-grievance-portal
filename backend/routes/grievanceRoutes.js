const express = require('express');
const router = express.Router();
const {
  submitGrievance,
  getGrievances,
  searchGrievances,
  getGrievanceById,
  updateGrievance,
  deleteGrievance,
} = require('../controllers/grievanceController');
const { protect } = require('../middleware/authMiddleware');

router.get('/search', protect, searchGrievances); // Must be before /:id

router.route('/')
  .post(protect, submitGrievance)
  .get(protect, getGrievances);

router.route('/:id')
  .get(protect, getGrievanceById)
  .put(protect, updateGrievance)
  .delete(protect, deleteGrievance);

module.exports = router;
