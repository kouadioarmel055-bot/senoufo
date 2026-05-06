const express = require('express');
const router = express.Router();
const { getFavorites, addFavorite, removeFavorite } = require('../controllers/favorites.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect); // All favorite routes require authentication

router.get('/', getFavorites);
router.post('/add', addFavorite);
router.delete('/:id', removeFavorite);

module.exports = router;
