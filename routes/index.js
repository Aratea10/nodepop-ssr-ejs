var express = require('express');

var router = express.Router();

router.get('/', function (req, res) {
  if (!req.session?.userId) return res.redirect('/auth/login');

  return res.redirect('/products');
});

module.exports = router;
