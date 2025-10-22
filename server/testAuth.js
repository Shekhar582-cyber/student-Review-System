const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const testAuth = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/teacher-reviews');
    console.log('Connected to MongoDB');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@university.edu' });
    
    if (!admin) {
      console.log('❌ Admin user not found in database');
      return;
    }
    
    console.log('✅ Admin user found:');
    console.log('- ID:', admin._id);
    console.log('- Name:', admin.name);
    console.log('- Email:', admin.email);
    console.log('- Role:', admin.role);
    console.log('- Password hash:', admin.password);
    
    // Test password comparison
    const testPassword = 'admin123';
    const isMatch = await bcrypt.compare(testPassword, admin.password);
    
    console.log('\n🔐 Password test:');
    console.log('- Test password:', testPassword);
    console.log('- Password matches:', isMatch ? '✅ YES' : '❌ NO');
    
    if (!isMatch) {
      console.log('\n🔧 Fixing password...');
      const newHashedPassword = await bcrypt.hash('admin123', 10);
      admin.password = newHashedPassword;
      await admin.save();
      console.log('✅ Password updated successfully');
      
      // Test again
      const isMatchAfterUpdate = await bcrypt.compare('admin123', admin.password);
      console.log('- Password matches after update:', isMatchAfterUpdate ? '✅ YES' : '❌ NO');
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    mongoose.connection.close();
  }
};

testAuth();