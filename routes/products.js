const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const requireAuth = require('../middlewares/requireAuth');
router.get('/', requireAuth, async (req, res, next) => {
    try {
        const userId = req.session.userId;
        const { tag, priceMin, priceMax, name, page = 1, limit = 10 } = req.query;
        const filter = { owner:userId };
        if (tag) filter.tags = tag;
        if (priceMin || priceMax) {
            filter.price = {};
            if (priceMin) filter.price.$gte = Number(priceMin);
            if (priceMax) filter.price.$lte = Number(priceMax);
        }
        if (name) filter.name = new RegExp('^' + name, 'i');
        const skip = (Number(page) -1) * Number(limit);
        const [items, total] = await Promise.all([
            Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
            Product.countDocuments(filter),
        ]);
        const totalPages = Math.ceil(total / Number(limit));
        res.render('products', {
            title: 'Mis Productos',
            items,
            page: Number(page),
            totalPages,
            query: { tag, priceMin, priceMax, name, limit },
        });
    } catch (e) {
        next(e);
    }
});
router.get('/new', requireAuth, (req, res) => {
    res.render('product-new', { title: 'Nuevo Producto', error: null });
});
router.post('/new', requireAuth, async (req, res, next) => {
    try {
        const { name, price, tags } = req.body;
        const owner = req.session.userId;
        const tagsArray = Array.isArray(tags)
            ? tags
            : (tags || '')
            .split(',')
            .map(t=> t.trim())
            .filter(Boolean);
        await Product.create({ name, price: Number(price), tags: tagsArray, owner });
        res.redirect('/products');
    } catch (e) {
        next(e);
    }
});
router.post('/:id/delete', requireAuth, async (req, res, next) => {
    try {
        const userId = req.session.userId;
        const { id } = req.params;
        await Product.deleteOne({_id: id, owner: userId });
        res.redirect('/products');
    } catch (e) {
        next(e);
    }
});
module.exports = router;