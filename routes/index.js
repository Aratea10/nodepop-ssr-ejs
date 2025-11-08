var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.session?.userId) {
    return res.redirect('/auth/login');
  }

  res.redirect('/products');
});

module.exports = router;
