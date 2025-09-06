// Fallback data when MongoDB is not available
const fallbackTeachers = [
  // Computer Science Department (F1-F13)
  { _id: '1', name: 'Nirmala A', department: 'Computer Science', subject: 'Data Structures & Algorithms', email: 'f1@university.edu', averageRating: 4.2, totalReviews: 15 },
  { _id: '2', name: 'Deepa M', department: 'Computer Science', subject: 'Object Oriented Programming', email: 'f2@university.edu', averageRating: 4.5, totalReviews: 22 },
  { _id: '3', name: 'Shweta G', department: 'Computer Science', subject: 'Database Management Systems', email: 'f3@university.edu', averageRating: 4.1, totalReviews: 18 },
  { _id: '4', name: 'Prof3', department: 'Computer Science', subject: 'Computer Networks', email: 'f4@university.edu', averageRating: 3.9, totalReviews: 12 },
  { _id: '5', name: 'F5', department: 'Computer Science', subject: 'Operating Systems', email: 'f5@university.edu', averageRating: 4.3, totalReviews: 20 },
  { _id: '6', name: 'F6', department: 'Computer Science', subject: 'Software Engineering', email: 'f6@university.edu', averageRating: 4.6, totalReviews: 25 },
  { _id: '7', name: 'F7', department: 'Computer Science', subject: 'Web Development', email: 'f7@university.edu', averageRating: 4.4, totalReviews: 30 },
  { _id: '8', name: 'F8', department: 'Computer Science', subject: 'Mobile App Development', email: 'f8@university.edu', averageRating: 4.0, totalReviews: 14 },
  { _id: '9', name: 'F9', department: 'Computer Science', subject: 'Computer Graphics', email: 'f9@university.edu', averageRating: 3.8, totalReviews: 10 },
  { _id: '10', name: 'F10', department: 'Computer Science', subject: 'Cybersecurity', email: 'f10@university.edu', averageRating: 4.7, totalReviews: 28 },
  { _id: '11', name: 'F11', department: 'Computer Science', subject: 'Cloud Computing', email: 'f11@university.edu', averageRating: 4.2, totalReviews: 16 },
  { _id: '12', name: 'F12', department: 'Computer Science', subject: 'Compiler Design', email: 'f12@university.edu', averageRating: 3.7, totalReviews: 8 },
  { _id: '13', name: 'F13', department: 'Computer Science', subject: 'Theory of Computation', email: 'f13@university.edu', averageRating: 3.9, totalReviews: 11 },
  
  // AI & Data Science Department (F14-F25)
  { _id: '14', name: 'Ashwini Kale', department: 'AI & Data Science', subject: 'Machine Learning', email: 'f14@university.edu', averageRating: 4.8, totalReviews: 35 },
  { _id: '15', name: 'Sunita T', department: 'AI & Data Science', subject: 'Deep Learning', email: 'f15@university.edu', averageRating: 4.6, totalReviews: 27 },
  { _id: '16', name: 'Netravati M', department: 'AI & Data Science', subject: 'Natural Language Processing', email: 'f16@university.edu', averageRating: 4.3, totalReviews: 19 },
  { _id: '17', name: 'Prof 4', department: 'AI & Data Science', subject: 'Computer Vision', email: 'f17@university.edu', averageRating: 4.4, totalReviews: 21 },
  { _id: '18', name: 'F18', department: 'AI & Data Science', subject: 'Data Mining', email: 'f18@university.edu', averageRating: 4.1, totalReviews: 17 },
  { _id: '19', name: 'F19', department: 'AI & Data Science', subject: 'Big Data Analytics', email: 'f19@university.edu', averageRating: 4.5, totalReviews: 24 },
  { _id: '20', name: 'F20', department: 'AI & Data Science', subject: 'Statistical Analysis', email: 'f20@university.edu', averageRating: 4.0, totalReviews: 13 },
  { _id: '21', name: 'F21', department: 'AI & Data Science', subject: 'Data Visualization', email: 'f21@university.edu', averageRating: 4.2, totalReviews: 18 },
  { _id: '22', name: 'F22', department: 'AI & Data Science', subject: 'Artificial Intelligence', email: 'f22@university.edu', averageRating: 4.7, totalReviews: 32 },
  { _id: '23', name: 'F23', department: 'AI & Data Science', subject: 'Neural Networks', email: 'f23@university.edu', averageRating: 4.3, totalReviews: 20 },
  { _id: '24', name: 'F24', department: 'AI & Data Science', subject: 'Reinforcement Learning', email: 'f24@university.edu', averageRating: 4.1, totalReviews: 15 },
  { _id: '25', name: 'F25', department: 'AI & Data Science', subject: 'Data Science Ethics', email: 'f25@university.edu', averageRating: 4.4, totalReviews: 22 }
];

const fallbackUsers = [];
const fallbackReviews = [];

module.exports = {
  fallbackTeachers,
  fallbackUsers,
  fallbackReviews
};