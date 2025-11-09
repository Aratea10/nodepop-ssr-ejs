const express = require('express');
const router = express.Router();
const { query, body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const requireAuth = require('../middlewares/requireAuth');

const ALLOWED_TAGS = ['work', 'lifestyle', 'motor', 'mobile'];
const LIMIT_MAX = 50;

// Utilidades
const toFloat = (v) => {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) ? n : undefined;
};
const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

router.get(
  '/',
  requireAuth,
  [
    query('tag').optional().isIn(ALLOWED_TAGS).withMessage('Tag inválido'),
    query('priceMin').optional().isFloat({ min: 0 }).withMessage('priceMin inválido'),
    query('priceMax').optional().isFloat({ min: 0 }).withMessage('priceMax inválido'),
    query('name').optional().isString().isLength({ max: 100 }).withMessage('name inválido'),
    query('page').optional().isInt({ min: 1 }).withMessage('page inválida'),
    query('limit').optional().isInt({ min: 1, max: LIMIT_MAX }).withMessage('limit inválido'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const first = errors.array()[0]?.msg || 'Parámetros inválidos';
        return res.status(400).render('products', {
          title: 'Mis productos',
          items: [],
          page: 1,
          totalPages: 1,
          query: req.query,
          error: first,
        });
      }

      const userId = req.session.userId;
      const { tag, priceMin, priceMax, name } = req.query;

      const page = Number.parseInt(req.query.page || '1', 10);
      const limit = Math.min(LIMIT_MAX, Math.max(1, Number.parseInt(req.query.limit || '10', 10)));
      const skip = (page - 1) * limit;

      const filter = { owner: userId };
      if (tag) filter.tags = tag;

      const min = toFloat(priceMin);
      const max = toFloat(priceMax);
      if (min !== undefined || max !== undefined) {
        filter.price = {};
        if (min !== undefined) filter.price.$gte = min;
        if (max !== undefined) filter.price.$lte = max;
      }

      if (name) filter.name = new RegExp('^' + escapeRegex(name), 'i');

      const [items, total] = await Promise.all([
        Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Product.countDocuments(filter),
      ]);

      const totalPages = Math.max(1, Math.ceil(total / limit));

      res.render('products', {
        title: 'Mis productos',
        items,
        page,
        totalPages,
        query: { tag, priceMin, priceMax, name, limit },
      });
    } catch (e) {
      next(e);
    }
  },
);

router.get('/new', requireAuth, (req, res) => {
  res.render('product-new', { title: 'Nuevo producto', error: null });
});

router.post(
  '/new',
  requireAuth,
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Nombre requerido')
      .isLength({ max: 100 })
      .withMessage('Nombre demasiado largo'),
    body('price').toFloat().isFloat({ min: 0 }).withMessage('Precio inválido'),
    body('tags')
      .optional()
      .customSanitizer((v) =>
        String(v || '')
          .split(',')
          .map((t) => String(t).trim())
          .filter(Boolean),
      )
      .custom((tags) => (Array.isArray(tags) ? tags.every((t) => ALLOWED_TAGS.includes(t)) : false))
      .withMessage('Tags inválidos (usa: work,lifestyle,motor,mobile)'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).render('product-new', {
          title: 'Nuevo producto',
          error: errors
            .array()
            .map((e) => e.msg)
            .join(' · '),
        });
      }

      const { name, price, tags } = req.body;
      const owner = req.session.userId;

      await Product.create({
        name: String(name).trim(),
        price: Number(price),
        tags,
        owner,
      });

      res.redirect('/products');
    } catch (e) {
      next(e);
    }
  },
);

router.post('/:id/delete', requireAuth, async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const { id } = req.params;
    await Product.deleteOne({ _id: id, owner: userId });
    res.redirect('/products');
  } catch (e) {
    next(e);
  }
});

module.exports = router;
