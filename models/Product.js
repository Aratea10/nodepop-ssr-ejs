const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, index: true },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        price: { type: Number, required: true, index: true },
        tags: {
            type: [String],
            enum: ['work', 'lifestyle', 'motor', 'mobile'],
            index: true,
        },
    },
    { timestamps: true}
);

module.exports = mongoose.model('Product', productSchema);