/**
 * Admin Seed Script
 * -----------------
 * Creates the first admin user in MongoDB.
 * Run once on a fresh database: node scripts/seedAdmin.js
 *
 * You can change the credentials below BEFORE running.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

// ─── CHANGE THESE BEFORE RUNNING ─────────────────────────────────────────────
const ADMIN_NAME     = 'MakertMyn Admin';
const ADMIN_EMAIL    = 'admin@makertmyn.co.za';
const ADMIN_PASSWORD = 'Admin@MakertMyn2026!';   // change after first login
// ──────────────────────────────────────────────────────────────────────────────

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/marketmyn');
        console.log('✅ MongoDB Connected');

        // Dynamically load the model (after connection)
        const User = require('../models/User');

        // Check if admin already exists
        const existing = await User.findOne({ email: ADMIN_EMAIL });
        if (existing) {
            console.log(`⚠️  Admin already exists: ${ADMIN_EMAIL}`);
            process.exit(0);
        }

        // Hash password
        const salt   = await bcrypt.genSalt(12);
        const hashed = await bcrypt.hash(ADMIN_PASSWORD, salt);

        // Create admin
        const admin = await User.create({
            name:     ADMIN_NAME,
            email:    ADMIN_EMAIL,
            password: hashed,
            role:     'admin',
            status:   'active',
            adminRoles: ['super_admin'],
        });

        console.log('');
        console.log('🎉 Admin user created successfully!');
        console.log('────────────────────────────────────');
        console.log(`   Email    : ${admin.email}`);
        console.log(`   Password : ${ADMIN_PASSWORD}`);
        console.log(`   Role     : ${admin.role}`);
        console.log('────────────────────────────────────');
        console.log('⚠️  Change the password after your first login!');
        console.log('');

        process.exit(0);
    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        process.exit(1);
    }
}

seed();
