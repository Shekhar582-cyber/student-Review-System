const mongoose = require('mongoose');
const Teacher = require('./models/Teacher');
require('dotenv').config();

const teachers = [
  // Computer Science Department (F1-F13)
  { name: 'Nirmala A', department: 'Computer Science', subject: '', email: 'f1@university.edu' },
  { name: 'Deepa M', department: 'Computer Science', subject: '', email: 'f2@university.edu' },
  { name: 'Shweta G ', department: 'Computer Science', subject: '', email: 'f3@university.edu' },
  { name: 'Prof3', department: 'Computer Science', subject: '', email: 'f4@university.edu' },
  { name: 'F5', department: 'Computer Science', subject: '', email: 'f5@university.edu' },
  { name: 'F6', department: 'Computer Science', subject: '', email: 'f6@university.edu' },
  { name: 'F7', department: 'Computer Science', subject: '', email: 'f7@university.edu' },
  { name: 'F8', department: 'Computer Science', subject: '', email: 'f8@university.edu' },
  { name: 'F9', department: 'Computer Science', subject: '', email: 'f9@university.edu' },
  { name: 'F10', department: 'Computer Science', subject: '', email: 'f10@university.edu' },
  { name: 'F11', department: 'Computer Science', subject: '', email: 'f11@university.edu' },
  { name: 'F12', department: 'Computer Science', subject: '', email: 'f12@university.edu' },
  { name: 'F13', department: 'Computer Science', subject: '', email: 'f13@university.edu' },
  
  // AI & Data Science Department (F14-F25)
  { name: 'Ashwini kale', department: 'AI & Data Science', subject: '', email: 'f14@university.edu' },
  { name: 'Sunita T', department: 'AI & Data Science', subject: '', email: 'f15@university.edu' },
  { name: 'Netravati M', department: 'AI & Data Science', subject: '', email: 'f16@university.edu' },
  { name: 'Prof 4', department: 'AI & Data Science', subject: '', email: 'f17@university.edu' },
  { name: 'F18', department: 'AI & Data Science', subject: '', email: 'f18@university.edu' },
  { name: 'F19', department: 'AI & Data Science', subject: '', email: 'f19@university.edu' },
  { name: 'F20', department: 'AI & Data Science', subject: '', email: 'f20@university.edu' },
  { name: 'F21', department: 'AI & Data Science', subject: '', email: 'f21@university.edu' },
  { name: 'F22', department: 'AI & Data Science', subject: '', email: 'f22@university.edu' },
  { name: 'F23', department: 'AI & Data Science', subject: '', email: 'f23@university.edu' },
  { name: 'F24', department: 'AI & Data Science', subject: '', email: 'f24@university.edu' },
  { name: 'F25', department: 'AI & Data Science', subject: '', email: 'f25@university.edu' }
];

async function seedTeachers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/teacher-reviews');
    
    // Clear existing teachers
    await Teacher.deleteMany({});
    
    // Insert new teachers
    await Teacher.insertMany(teachers);
    
    console.log('25 teachers have been added to the database!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding teachers:', error);
    process.exit(1);
  }
}

seedTeachers();