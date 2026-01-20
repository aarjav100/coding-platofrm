const asyncHandler = require('express-async-handler');
const StoreItem = require('../models/StoreItem');
const User = require('../models/User');

// @desc    Get all store items
// @route   GET /api/store
// @access  Private
const getItems = asyncHandler(async (req, res) => {
    const items = await StoreItem.find({});
    res.json(items);
});

// @desc    Buy an item
// @route   POST /api/store/buy
// @access  Private
const buyItem = asyncHandler(async (req, res) => {
    const { itemId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const item = await StoreItem.findById(itemId);

    if (!item) {
        res.status(404);
        throw new Error('Item not found');
    }

    if (user.points < item.price) {
        res.status(400);
        throw new Error('Not enough points');
    }

    // Check if user already owns the item (optional logic, but let's allow duplicates for now or unique?)
    // Let's assume consumables or collectables can be bought multiple times, but for sleeves/caps maybe just once?
    // For simplicity, we allow multiple purchases.

    user.points -= item.price;
    user.inventory.push({ item: item._id });

    await user.save();

    res.json({
        points: user.points,
        inventory: user.inventory,
        message: `Successfully purchased ${item.name}`
    });
});

// @desc    Seed store items
// @route   POST /api/store/seed
// @access  Private (Admin only ideally, but public for dev)
const seedItems = asyncHandler(async (req, res) => {
    const items = [
        {
            name: "CodeMaster Cap",
            description: "A stylish cap with the CodeMaster logo.",
            price: 500,
            type: "cap",
            image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=1000"
        },
        {
            name: "Dev T-Shirt",
            description: "Cotton t-shirt for comfortable coding sessions.",
            price: 1000,
            type: "shirt",
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1000"
        },
        {
            name: "Laptop Sleeve",
            description: "Protective sleeve for your machine.",
            price: 1500,
            type: "laptop_sleeve",
            image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=1000"
        },
        {
            name: "Code Sticker Pack",
            description: "Decorate your laptop with cool dev stickers.",
            price: 200,
            type: "sticker",
            image: "https://images.unsplash.com/photo-1572375992501-16c0287dd4c3?auto=format&fit=crop&q=80&w=1000"
        },
        {
            name: "Blind 75 & Grind 169 Cheat Sheet",
            description: "The ultimate curated list of LeetCode patterns for ace interviews.",
            price: 500,
            type: "dsa_sheet",
            image: "https://images.unsplash.com/photo-1544396821-4dd40b938ad3?auto=format&fit=crop&q=80&w=1000"
        },
        {
            name: "System Design Masterclass",
            description: "Comprehensive course on designing scalable distributed systems.",
            price: 2000,
            type: "course",
            image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1000"
        },
        {
            name: "Premium Contest Entry Ticket",
            description: "One-time pass to enter a premium prize pool contest.",
            price: 100,
            type: "contest_pass",
            image: "https://images.unsplash.com/photo-1543536448-d209d2d13a1c?auto=format&fit=crop&q=80&w=1000"
        },
        {
            name: "1-on-1 Mock Interview",
            description: "1 hour mock interview with a FAANG engineer.",
            price: 1500,
            type: "mentorship",
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000"
        }
    ];

    // Clear existing to avoid duplicates if re-seeding deeply, 
    // but for safety let's just delete all and re-insert if we want fresh state on 'seed' call.
    // NOTE: In production be careful. Here for dev it is fine.
    await StoreItem.deleteMany({});

    await StoreItem.insertMany(items);
    res.json({ message: 'Store seeded successfully' });
});

module.exports = {
    getItems,
    buyItem,
    seedItems
};
