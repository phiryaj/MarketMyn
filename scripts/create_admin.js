const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/marketmyn')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const createAdmin = async () => {
    try {
        const adminExists = await User.findOne({ email: 'admin@marketmyn.com' });

        if (adminExists) {
            console.log('Admin user already exists');
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const adminUser = new User({
            name: 'Super Admin',
            email: 'admin@marketmyn.com',
            password: hashedPassword,
            role: 'admin',
            status: 'active'
        });

        await adminUser.save();
        console.log('Admin user created successfully');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createAdmin();
