const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const requireAuth = require('../middlewares/requireAuth');

/* GET home page with all products. */
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).populate('owner');
    res.render('index', {
      title: 'Nodepop',
      products,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
