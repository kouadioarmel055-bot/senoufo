const express = require('express');
const router = express.Router();
const motsController = require('../controllers/mots.controller');

// Routes pour les catégories
router.get('/categories', motsController.getCategories);

// Routes pour les mots
router.get('/', motsController.getMots);
router.get('/populaires', motsController.getMotsPopulaires);

module.exports = router;
