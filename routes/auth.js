const express = require('express');
const router = express.Router();
const User = require('../models/User');
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login', error: null });
});
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).render('login', { title: 'Login', error: 'Credenciales inválidas' });
    }
    req.session.userId = user._id.toString();
    res.redirect('/');
  } catch (e) {
    next(e);
  }
});
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});
module.exports = router;
