# Teacher Review System

A React + Vite web application for students to review teachers and admins to view overall reviews, built with MongoDB database.

## Features

- **Student Features:**
  - Register/Login as student
  - View all teachers with ratings
  - Submit reviews for teachers
  - Rate teachers (1-5 stars)
  - Add comments and subject details

- **Admin Features:**
  - Register/Login as admin
  - View all teachers and their ratings
  - Add new teachers to the system
  - View detailed reviews for each teacher
  - Dashboard with statistics

## Tech Stack

- **Frontend:** React, Vite, React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT tokens
- **Styling:** CSS3

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd teacher-review-app
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Setup environment variables:**
   - Update the `.env` file in the root directory
   - Set your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/teacher-reviews
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   ```

5. **Start MongoDB:**
   - If using local MongoDB: `mongod`
   - If using MongoDB Atlas: ensure your connection string is correct

6. **Start the backend server:**
   ```bash
   cd server
   npm run dev
   ```

7. **Start the frontend (in a new terminal):**
   ```bash
   npm run dev
   ```

8. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Usage

### For Students:
1. Register with student role and student ID
2. Login to access the dashboard
3. Browse available teachers
4. Click "Write Review" to submit feedback
5. Rate teachers and provide detailed comments

### For Admins:
1. Register with admin role
2. Login to access admin dashboard
3. View statistics and teacher management
4. Add new teachers to the system
5. View detailed reviews for each teacher

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Teachers
- `GET /api/teachers` - Get all teachers
- `POST /api/teachers` - Add new teacher (admin)
- `GET /api/teachers/:id/reviews` - Get reviews for specific teacher

### Reviews
- `POST /api/reviews` - Submit new review (authenticated)
- `GET /api/reviews` - Get all reviews (admin)

## Database Schema

### User
- name, email, password, role (student/admin), studentId

### Teacher
- name, department, subject, email, averageRating, totalReviews

### Review
- student (ref), teacher (ref), rating, comment, subject, semester

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.