const mongoose = require('mongoose');
const User = require('./models/User');
const Teacher = require('./models/Teacher');
const Review = require('./models/Review');
require('dotenv').config();

const setupIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/teacher-reviews');
    console.log('Connected to MongoDB for index setup');

    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ role: 1 });
    await User.collection.createIndex({ studentId: 1 });
    console.log('✅ User indexes created');

    // Teacher indexes
    await Teacher.collection.createIndex({ email: 1 }, { unique: true });
    await Teacher.collection.createIndex({ department: 1 });
    await Teacher.collection.createIndex({ name: 1 });
    await Teacher.collection.createIndex({ averageRating: -1 }); // Descending for top-rated
    await Teacher.collection.createIndex({ totalReviews: -1 });
    await Teacher.collection.createIndex({ department: 1, averageRating: -1 }); // Compound index
    console.log('✅ Teacher indexes created');

    // Review indexes
    await Review.collection.createIndex({ teacherId: 1 });
    await Review.collection.createIndex({ studentId: 1 });
    await Review.collection.createIndex({ createdAt: -1 }); // Recent reviews first
    await Review.collection.createIndex({ overallRating: -1 });
    await Review.collection.createIndex({ teacherId: 1, createdAt: -1 }); // Compound index
    await Review.collection.createIndex({ studentId: 1, teacherId: 1 }, { unique: true }); // Prevent duplicate reviews
    console.log('✅ Review indexes created');

    console.log('🎉 All database indexes created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up indexes:', error);
    process.exit(1);
  }
};

setupIndexes();