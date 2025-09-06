const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  
  // Detailed ratings
  overallRating: { type: Number, required: true, min: 1, max: 5 },
  teachingMethodRating: { type: Number, required: true, min: 1, max: 5 },
  punctualityRating: { type: Number, required: true, min: 1, max: 5 },
  knowledgeRating: { type: Number, required: true, min: 1, max: 5 },
  communicationRating: { type: Number, required: true, min: 1, max: 5 },
  
  // Class attendance and regularity
  classAttendance: { type: String, enum: ['Regular', 'Sometimes', 'Rarely'], required: true },
  teacherPunctuality: { type: String, enum: ['Always On Time', 'Usually On Time', 'Often Late', 'Always Late'], required: true },
  
  // Teaching method feedback
  teachingMethod: { type: String, enum: ['Excellent', 'Good', 'Average', 'Poor'], required: true },
  useOfTechnology: { type: String, enum: ['Excellent', 'Good', 'Average', 'Poor'], required: true },
  
  // Additional feedback
  comment: { type: String, required: true },
  subject: { type: String, required: true },
  semester: { type: String, required: true },
  
  // Recommendations
  wouldRecommend: { type: Boolean, required: true },
  difficulty: { type: String, enum: ['Very Easy', 'Easy', 'Moderate', 'Hard', 'Very Hard'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);