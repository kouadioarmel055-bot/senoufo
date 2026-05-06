const express = require('express');
const router = express.Router();
const { getProgress, addXp, completeLesson } = require('./progress.controller');
const { protect } = require('./auth.middleware');

router.use(protect); // Require auth

router.get('/', getProgress);
router.post('/xp', addXp);
router.post('/lesson', completeLesson);

module.exports = router;
