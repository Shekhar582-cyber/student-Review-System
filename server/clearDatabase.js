const mongoose = require('mongoose');
const User = require('./models/User');
const Teacher = require('./models/Teacher');
const Review = require('./models/Review');
require('dotenv').config();

async function clearDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/teacher-reviews');
    console.log('Connected to MongoDB');

    // Clear all collections
    console.log('Clearing all data...');
    
    await Review.deleteMany({});
    console.log('✅ Cleared all reviews');
    
    await Teacher.deleteMany({});
    console.log('✅ Cleared all teachers');
    
    await User.deleteMany({});
    console.log('✅ Cleared all users');

    console.log('\n🗑️  Database cleared successfully!');
    console.log('All reviews, teachers, and users have been removed.');
    
    mongoose.connection.close();
    console.log('Database connection closed.');
    
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    mongoose.connection.close();
  }
}

clearDatabase();