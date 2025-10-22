const express = require('express');
const Review = require('../models/Review');
const Teacher = require('../models/Teacher');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify token
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Submit review
router.post('/', auth, async (req, res) => {
  try {
    const reviewData = {
      student: req.userId,
      teacher: req.body.teacherId,
      ...req.body
    };
    delete reviewData.teacherId;
    
    const review = new Review(reviewData);
    await review.save();
    
    // Update teacher's average rating based on overall rating
    const reviews = await Review.find({ teacher: req.body.teacherId });
    const avgRating = reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length;
    
    await Teacher.findByIdAndUpdate(req.body.teacherId, {
      averageRating: avgRating,
      totalReviews: reviews.length
    });
    
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all reviews (admin only)
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('student', 'name studentId')
      .populate('teacher', 'name department subject')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;