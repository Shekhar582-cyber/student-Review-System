const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function addStudentIdIndex() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/teacher-reviews');
    console.log('Connected to MongoDB');

    // Drop existing index if it exists
    try {
      await User.collection.dropIndex('studentId_1');
      console.log('Dropped existing studentId index');
    } catch (error) {
      console.log('No existing index to drop or error dropping:', error.message);
    }

    // Create unique index on studentId field
    await User.collection.createIndex({ studentId: 1 }, { unique: true, sparse: true });
    console.log('✅ Unique index created on studentId field');
    
    mongoose.connection.close();
    console.log('Database connection closed.');
    
  } catch (error) {
    console.error('❌ Error creating index:', error);
    mongoose.connection.close();
  }
}

addStudentIdIndex();