const express = require('express');
const router = express.Router();
const { query, body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const User = require('../models/User');
const requireAuth = require('../middlewares/requireAuth');

const ALLOWED_TAGS = ['work', 'lifestyle', 'motor', 'mobile'];
const LIMIT_MAX = 50;

function toInt(v, fb) {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : fb;
}
function toFloat(v) {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) ? n : undefined;
}
function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

router.get(
  '/',
  requireAuth,
  [
    query('tag').optional({ checkFalsy: true }).isIn(ALLOWED_TAGS).withMessage('Tag inválido'),
    query('priceMin')
      .optional({ checkFalsy: true })
      .isFloat({ min: 0 })
      .withMessage('priceMin inválido'),
    query('priceMax')
      .optional({ checkFalsy: true })
      .isFloat({ min: 0 })
      .withMessage('priceMax inválido'),
    query('name')
      .optional({ checkFalsy: true })
      .isString()
      .isLength({ max: 100 })
      .withMessage('name inválido'),
    query('skip').optional({ checkFalsy: true }).isInt({ min: 0 }).withMessage('skip inválido'),
    query('page').optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage('page inválida'),
    query('limit')
      .optional({ checkFalsy: true })
      .isInt({ min: 1, max: LIMIT_MAX })
      .withMessage('limit inválido'),
    query('sort')
      .optional({ checkFalsy: true })
      .isIn(['price-asc', 'price-desc', 'name', 'name-desc'])
      .withMessage('Sort inválido'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const first = errors.array()[0]?.msg || 'Parámetros inválidos';
        const user = await User.findById(req.session.userId);
        return res.status(400).render('index', {
          title: 'Mis productos',
          items: [],
          page: 1,
          totalPages: 1,
          query: req.query,
          error: first,
          user,
          userId: req.session.userId,
        });
      }

      const sessionUserId = req.session.userId;
      const { tag, priceMin, priceMax, name, sort } = req.query;

      const page = Math.max(1, toInt(req.query.page || '1', 1));
      const limit = Math.min(LIMIT_MAX, Math.max(1, toInt(req.query.limit || '8', 8)));
      const rawSkip = req.query.skip;
      const skip =
        rawSkip !== undefined && rawSkip !== ''
          ? Math.max(0, toInt(rawSkip, 0))
          : (page - 1) * limit;

      const filter = { owner: sessionUserId };
      if (tag) filter.tags = tag;

      const min = toFloat(priceMin);
      const max = toFloat(priceMax);
      if (min !== undefined || max !== undefined) {
        filter.price = {};
        if (min !== undefined) filter.price.$gte = min;
        if (max !== undefined) filter.price.$lte = max;
        if (Object.keys(filter.price).length === 0) delete filter.price;
      }

      if (name) {
        filter.name = new RegExp('^' + escapeRegex(name), 'i');
      }

      let sortOptions = { createdAt: -1 };
      if (sort === 'price-asc') sortOptions = { price: 1 };
      if (sort === 'price-desc') sortOptions = { price: -1 };
      if (sort === 'name') sortOptions = { name: 1 };
      if (sort === 'name-desc') sortOptions = { name: -1 };

      const [items, total, user] = await Promise.all([
        Product.find(filter).populate('owner').sort(sortOptions).skip(skip).limit(limit),
        Product.countDocuments(filter),
        User.findById(sessionUserId),
      ]);

      const totalPages = Math.max(1, Math.ceil(total / limit));
      const title = 'Mis productos';
      const activeTab = 'mine';

      res.render('index', {
        title,
        items,
        page,
        totalPages,
        query: req.query,
        user,
        userId: sessionUserId,
        activeTab,
      });
    } catch (e) {
      next(e);
    }
  },
);

router.get('/new', requireAuth, async (req, res) => {
  const userId = req.session.userId;
  const user = await User.findById(userId);
  res.render('product-new', {
    title: 'Nuevo producto',
    error: null,
    userId,
    user,
    activeTab: 'new',
  });
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

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }
    if (product.owner.toString() !== userId) {
      return res.status(403).send('No tienes permiso para borrar este producto');
    }

    await Product.deleteOne({ _id: id });

    const referer = req.get('referer');
    if (referer && referer.includes('/products')) {
      return res.redirect(referer);
    }
    res.redirect('/products');
  } catch (e) {
    next(e);
  }
});

module.exports = router;
