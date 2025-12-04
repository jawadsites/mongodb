// Run this script to fix admin role
// Usage: node fix-admin.js

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://ktala4020_db_user:xvealudtOVWCzFdg@cluster0.n4nedqq.mongodb.net/medical_db?retryWrites=true&w=majority';

async function fixAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // First, list all users
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log('All users:');
    users.forEach(u => console.log(`- ${u.email} (role: ${u.role})`));

    // Update the admin user
    const result = await mongoose.connection.db.collection('users').updateOne(
      { email: 'bashir2002sy@gmail.com' },
      { $set: { role: 'مسؤول' } }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ Admin role updated successfully!');
    } else if (result.matchedCount > 0) {
      console.log('⚠️ User found but already has this role');
    } else {
      console.log('⚠️ User not found');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
}

fixAdmin();
