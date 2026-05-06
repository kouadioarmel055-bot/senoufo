const express = require('express');
const router = express.Router();
const { getProgress, addXp, completeLesson } = require('../controllers/progress.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect); // Require auth

router.get('/', getProgress);
router.post('/xp', addXp);
router.post('/lesson', completeLesson);

module.exports = router;
