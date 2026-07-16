require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');

async function seedProduct() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/marketmyn');
        console.log('✅ MongoDB Connected');

        // Find a vendor to attach this product to. We'll use the admin user we just created.
        const vendor = await User.findOne({ email: 'admin@makertmyn.co.za' });
        
        if (!vendor) {
            console.log('❌ Vendor not found. Please ensure the admin user exists.');
            process.exit(1);
        }

        // Check if product already exists to avoid duplicates
        const existingProduct = await Product.findOne({ title: 'Trojan Speed Rope' });
        if (existingProduct) {
            console.log('⚠️ Product already exists in the database. Deleting old one to replace...');
            await Product.deleteOne({ _id: existingProduct._id });
        }

        const newProduct = await Product.create({
            title: 'Trojan Speed Rope',
            price: 150, // Added a reasonable mock price
            description: `Elevate your fitness game with the Trojan Speed Rope, designed for all fitness levels. Whether you're a beginner or an experienced athlete, this speed rope is your ideal companion for cardio, endurance, and agility workouts.

Adjustable Length: Easily customize the rope length to fit your height and workout preferences.
Lightweight & Portable: Compact and easy to carry, perfect for workouts at home, the gym, or on the go.
Durable Construction: Made from high-quality materials to ensure long-lasting performance, even with regular use.
Comfortable Grip Handles: Ergonomically designed handles with a non-slip surface for a secure and comfortable grip during intense sessions.
Versatile Use: Suitable for cardio, HIIT, endurance, weight loss, and agility training.

Specifications:
Material: PVC-coated rope with ergonomic plastic handles
Rope Length: Adjustable up to 2.7 meters
Weight: Lightweight for fast and smooth rotation

What's in the box:
1 x Trojan Speed Rope`,
            image: 'assets/trojan-rope-1.png', // High-quality jump rope
            images: [
                'assets/trojan-rope-1.png',
                'assets/trojan-rope-2.png',
                'assets/trojan-rope-3.png',
                'assets/trojan-rope-4.png'
            ],
            category: 'Sports',
            stock: 50,
            vendor: vendor._id,
            vendorName: vendor.storeName || vendor.name,
            status: 'approved' // Automatically approve it so it shows up on the frontend
        });

        console.log('🎉 Successfully added product: Trojan Speed Rope');
        console.log('Category:', newProduct.category);
        process.exit(0);
    } catch (err) {
        console.error('❌ Failed to add product:', err);
        process.exit(1);
    }
}

seedProduct();
