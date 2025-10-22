const mongoose = require('mongoose');
const Review = require('./models/Review');
const Teacher = require('./models/Teacher');
const User = require('./models/User');
require('dotenv').config();

const sampleReviews = [
  {
    overallRating: 5,
    teachingMethodRating: 5,
    punctualityRating: 4,
    knowledgeRating: 5,
    communicationRating: 4,
    classAttendance: 'Regular',
    teacherPunctuality: 'Always On Time',
    teachingMethod: 'Excellent',
    useOfTechnology: 'Good',
    comment: 'Excellent teacher! Very knowledgeable and engaging.',
    subject: 'Machine Learning',
    semester: 'Fall 2024',
    difficulty: 'Moderate',
    wouldRecommend: true
  },
  {
    overallRating: 4,
    teachingMethodRating: 4,
    punctualityRating: 5,
    knowledgeRating: 4,
    communicationRating: 4,
    classAttendance: 'Regular',
    teacherPunctuality: 'Always On Time',
    teachingMethod: 'Good',
    useOfTechnology: 'Excellent',
    comment: 'Good teaching style, always on time.',
    subject: 'Machine Learning',
    semester: 'Fall 2024',
    difficulty: 'Easy',
    wouldRecommend: true
  },
  {
    overallRating: 3,
    teachingMethodRating: 3,
    punctualityRating: 3,
    knowledgeRating: 4,
    communicationRating: 3,
    classAttendance: 'Sometimes',
    teacherPunctuality: 'Usually On Time',
    teachingMethod: 'Average',
    useOfTechnology: 'Average',
    comment: 'Could improve communication skills.',
    subject: 'Machine Learning',
    semester: 'Fall 2024',
    difficulty: 'Hard',
    wouldRecommend: false
  }
];

async function seedReviews() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/teacher-reviews');
    console.log('Connected to MongoDB');

    // Get first teacher and create a dummy student
    const teacher = await Teacher.findOne();
    if (!teacher) {
      console.log('No teachers found. Please run seedTeachers.js first.');
      process.exit(1);
    }

    // Create a dummy student for reviews
    let student = await User.findOne({ role: 'student' });
    if (!student) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('student123', 10);
      student = new User({
        name: 'Test Student',
        email: 'student@test.com',
        password: hashedPassword,
        role: 'student',
        studentId: 'ST001'
      });
      await student.save();
      console.log('Created test student');
    }

    // Clear existing reviews for this teacher
    await Review.deleteMany({ teacher: teacher._id });

    // Create sample reviews
    const reviews = sampleReviews.map(review => ({
      ...review,
      teacher: teacher._id,
      student: student._id
    }));

    await Review.insertMany(reviews);

    // Update teacher's average rating
    const avgRating = reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length;
    await Teacher.findByIdAndUpdate(teacher._id, {
      averageRating: avgRating,
      totalReviews: reviews.length
    });

    console.log(`Created ${reviews.length} sample reviews for ${teacher.name}`);
    console.log('Analytics should now work for this teacher!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding reviews:', error);
    process.exit(1);
  }
}

seedReviews();