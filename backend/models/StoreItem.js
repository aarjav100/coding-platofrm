const mongoose = require('mongoose');

const storeItemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['cap', 'shirt', 'laptop_sleeve', 'sticker', 'other', 'dsa_sheet', 'course', 'contest_pass', 'mentorship']
    },
    image: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const StoreItem = mongoose.model('StoreItem', storeItemSchema);
module.exports = StoreItem;
