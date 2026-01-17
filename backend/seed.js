const mongoose = require('mongoose');
const User = require('./models/User');

async function seedAdmin() {
    await mongoose.connect('mongodb://localhost:27017/opsmind');
    
    // Create admin user manually
    const adminUser = new User({
        email: 'vijaykarthik2512@gmail.com',
        password: 'admin123', // Will be hashed automatically
        role: 'admin'
    });
    
    try {
        await adminUser.save();
        console.log('Admin user created successfully!');
        console.log('Email: vijaykarthik2512@gmail.com');
        console.log('Password: admin123');
    } catch (error) {
        console.log('Admin user already exists or error:', error.message);
    }
    
    mongoose.connection.close();
}

seedAdmin();