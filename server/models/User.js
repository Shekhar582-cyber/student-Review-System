const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  studentId: { 
    type: String, 
    required: function() { return this.role === 'student'; },
    unique: true,
    sparse: true // This allows null values but ensures uniqueness for non-null values
  },
  department: { 
    type: String, 
    required: function() { return this.role === 'student'; },
    enum: ['Computer Science', 'AI & Data Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil']
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);