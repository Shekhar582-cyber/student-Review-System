const express = require('express');
const Teacher = require('../models/Teacher');
const Review = require('../models/Review');
const { fallbackTeachers } = require('../fallbackData');
const { cacheMiddleware, clearCache } = require('../middleware/cache');
const mongoose = require('mongoose');

const router = express.Router();

// Get all teachers (filtered by department for students)
router.get('/', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('Using fallback teacher data');
      // Filter fallback data by department if provided
      const department = req.query.department;
      const filteredTeachers = department 
        ? fallbackTeachers.filter(teacher => teacher.department === department)
        : fallbackTeachers;
      return res.json(filteredTeachers);
    }
    
    // Build query based on department filter
    const query = {};
    if (req.query.department) {
      query.department = req.query.department;
    }
    
    // Optimized query with selected fields only
    const teachers = await Teacher.find(query)
      .select('name department subject email averageRating totalReviews')
      .lean(); // Returns plain JS objects for better performance
    
    res.json(teachers);
  } catch (error) {
    console.log('Error fetching teachers, using fallback data:', error.message);
    // Filter fallback data by department if provided
    const department = req.query.department;
    const filteredTeachers = department 
      ? fallbackTeachers.filter(teacher => teacher.department === department)
      : fallbackTeachers;
    res.json(filteredTeachers);
  }
});

// Add teacher (admin only)
router.post('/', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database not available' });
    }
    
    const teacher = new Teacher(req.body);
    await teacher.save();
    
    // Clear teachers cache when new teacher is added
    clearCache('/api/teachers');
    
    res.status(201).json(teacher);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Teacher with this email already exists' });
    }
    res.status(500).json({ message: error.message });
  }
});

// Get teacher with reviews - simplified for analytics
router.get('/:id/reviews', async (req, res) => {
  try {
    console.log(`Fetching reviews for teacher: ${req.params.id}`);
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('MongoDB not connected, returning empty reviews');
      return res.json([]); // Return empty reviews for fallback
    }
    
    const reviews = await Review.find({ teacher: req.params.id })
      .populate('student', 'name studentId')
      .sort({ createdAt: -1 })
      .lean();
    
    console.log(`Found ${reviews.length} reviews for teacher ${req.params.id}`);
    
    // Return just the reviews array for analytics compatibility
    res.json(reviews);
  } catch (error) {
    console.log('Error fetching reviews:', error.message);
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
});

module.exports = router;