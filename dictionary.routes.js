const express = require('express');
const router = express.Router();
const dictController = require('../controllers/dictionary.controller');

router.get('/translate/to-senoufo', dictController.translateToSenoufo);
router.get('/translate/to-french', dictController.translateToFrench);
router.get('/categories', dictController.getCategories);
router.get('/category/:category', dictController.getCategoryWords);
router.get('/dictionary', dictController.getDictionary);
router.get('/search', dictController.searchDictionary);

module.exports = router;
