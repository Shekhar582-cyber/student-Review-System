import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// User model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  studentId: { type: String },
  department: { type: String }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { name, email, password, role, studentId, department } = req.body;
    
    // Prevent admin registration
    if (role === 'admin') {
      return res.status(403).json({ message: 'Admin registration is not allowed. Admin credentials are fixed.' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      role: 'student', 
      studentId, 
      department 
    });
    
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.status(201).json({ 
      token, 
      user: { 
        id: user._id, 
        name, 
        email, 
        role: 'student', 
        department 
      } 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
}