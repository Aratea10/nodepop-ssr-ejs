var express = require('express');
var router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const requireAuth = require('../middlewares/requireAuth');

router.get('/', requireAuth, async function (req, res, next) {
  try {
    const userId = req.session.userId;

    const [user, items] = await Promise.all([
      User.findById(userId),
      Product.find({ owner: userId }).sort({ createdAt: -1 }).limit(6).populate('owner'),
    ]);

    return res.render('index', {
      title: 'Inicio',
      user,
      userId,
      items,
      query: {},
      page: 1,
      totalPages: 1,
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
