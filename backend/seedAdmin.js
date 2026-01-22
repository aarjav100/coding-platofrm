const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const adminExists = await User.findOne({ email: 'admin@codemaster.com' });
        if (adminExists) {
            console.log('Admin user already exists');
            adminExists.role = 'admin';
            await adminExists.save();
            console.log('Admin role ensured');
            process.exit();
        }

        const admin = await User.create({
            username: 'Admin',
            email: 'admin@codemaster.com',
            password: 'adminpassword123',
            role: 'admin',
            points: 1000
        });

        console.log('Admin user created:', admin.email);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedAdmin();
