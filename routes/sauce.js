const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

// LIKE A SAUCE
router.post('/:id/like', auth, sauceCtrl.likeSauce);

// DELETE A SAUCE
router.delete('/:id', auth, sauceCtrl.deleteSauce);

// UPDATE A SAUCE
router.put('/:id', auth, multer, sauceCtrl.updateSauce);

// ADD A SAUCE
router.post('/', auth, multer, sauceCtrl.addSauce);

// GET A SAUCE
router.get('/:id', auth, sauceCtrl.getSauce);

// GET ALL SAUCES
router.get('/', auth, sauceCtrl.getAllSauces);

module.exports = router;