import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const StudentDashboard = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    overallRating: 5,
    teachingMethodRating: 5,
    punctualityRating: 5,
    knowledgeRating: 5,
    communicationRating: 5,
    classAttendance: 'Regular',
    teacherPunctuality: 'Always On Time',
    teachingMethod: 'Excellent',
    useOfTechnology: 'Excellent',
    comment: '',
    subject: '',
    semester: '',
    wouldRecommend: true,
    difficulty: 'Moderate'
  });
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Debug: Log user data
  useEffect(() => {
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    console.log('Current user:', user);
    console.log('User department:', user?.department);
  }, []);

  const fetchTeachers = async () => {
    try {
      // Get the current user's department from localStorage
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      
      console.log('Fetching teachers for user:', user);
      
      // Always fetch all teachers first, then filter on frontend if needed
      const url = `${API_BASE_URL}/teachers`;
      
      console.log('API URL:', url);
      
      const response = await axios.get(url);
      console.log('Teachers received:', response.data);
      setTeachers(response.data);
      
      // If user has a department, set the filter dropdown to their department
      if (user && user.department) {
        setFilterDepartment(user.department);
        console.log('Set filter department to:', user.department);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/reviews`, {
        teacherId: selectedTeacher._id,
        ...reviewForm
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Review submitted successfully!');
      setShowForm(false);
      resetForm();
      fetchTeachers(); // Refresh to show updated ratings
    } catch (error) {
      alert('Error submitting review: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const resetForm = () => {
    setReviewForm({
      overallRating: 5,
      teachingMethodRating: 5,
      punctualityRating: 5,
      knowledgeRating: 5,
      communicationRating: 5,
      classAttendance: 'Regular',
      teacherPunctuality: 'Always On Time',
      teachingMethod: 'Excellent',
      useOfTechnology: 'Excellent',
      comment: '',
      subject: '',
      semester: '',
      wouldRecommend: true,
      difficulty: 'Moderate'
    });
    setSelectedTeacher(null);
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (teacher.subject && teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDepartment = filterDepartment === '' || teacher.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const departments = [...new Set(teachers.map(t => t.department))];

  // Get current user info
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  return (
    <div className="dashboard">
      <h2>Student Dashboard - Rate Your Teachers</h2>
      {user && user.department && (
        <div className="student-info">
          <p><strong>Your Department:</strong> {user.department}</p>
          <p><em>Showing teachers from your department</em></p>
        </div>
      )}

      <div className="filters">
        <input
          type="text"
          placeholder="Search teachers or subjects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="filter-select"
        >
          <option value="">All Departments</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      <div className="departments-section">
        {departments.map(dept => {
          const deptTeachers = filteredTeachers.filter(t => t.department === dept);
          if (deptTeachers.length === 0) return null;

          return (
            <div key={dept} className="department-group">
              <h3 className="department-title">
                {dept === 'Computer Science' ? '💻' : '🤖'} {dept} Department ({deptTeachers.length} Teachers)
              </h3>
              <div className="teachers-grid">
                {deptTeachers.map(teacher => (
                  <div key={teacher._id} className="teacher-card">
                    <div className="teacher-header">
                      <h4 className="teacher-name">{teacher.name}</h4>
                      <div className="rating-badge">
                        ⭐ {teacher.averageRating.toFixed(1)}/5
                      </div>
                    </div>
                    <div className="teacher-details">
                      <p><strong>📚 Subject:</strong> {teacher.subject || 'Not specified'}</p>
                      <p><strong>📊 Reviews:</strong> {teacher.totalReviews} student{teacher.totalReviews !== 1 ? 's' : ''}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedTeacher(teacher);
                        setShowForm(true);
                      }}
                      className="review-btn"
                    >
                      📝 Write Review
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {filteredTeachers.length === 0 && (
          <div className="no-results">
            <h3>🔍 No teachers found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {showForm && selectedTeacher && (
        <div className="modal">
          <div className="modal-content large-modal">
            <h3>📋 Detailed Review for {selectedTeacher.name}</h3>
            <p className="teacher-info">{selectedTeacher.department} - {selectedTeacher.subject}</p>

            <form onSubmit={handleSubmitReview} className="detailed-review-form">

              {/* Rating Section */}
              <div className="form-section">
                <h4>📊 Rating Categories</h4>
                <div className="rating-grid">
                  <div className="rating-item">
                    <label>Overall Rating:</label>
                    <select value={reviewForm.overallRating} onChange={(e) => setReviewForm({ ...reviewForm, overallRating: parseInt(e.target.value) })}>
                      {[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>{num} ⭐</option>)}
                    </select>
                  </div>
                  <div className="rating-item">
                    <label>Teaching Method:</label>
                    <select value={reviewForm.teachingMethodRating} onChange={(e) => setReviewForm({ ...reviewForm, teachingMethodRating: parseInt(e.target.value) })}>
                      {[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>{num} ⭐</option>)}
                    </select>
                  </div>
                  <div className="rating-item">
                    <label>Punctuality:</label>
                    <select value={reviewForm.punctualityRating} onChange={(e) => setReviewForm({ ...reviewForm, punctualityRating: parseInt(e.target.value) })}>
                      {[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>{num} ⭐</option>)}
                    </select>
                  </div>
                  <div className="rating-item">
                    <label>Knowledge:</label>
                    <select value={reviewForm.knowledgeRating} onChange={(e) => setReviewForm({ ...reviewForm, knowledgeRating: parseInt(e.target.value) })}>
                      {[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>{num} ⭐</option>)}
                    </select>
                  </div>
                  <div className="rating-item">
                    <label>Communication:</label>
                    <select value={reviewForm.communicationRating} onChange={(e) => setReviewForm({ ...reviewForm, communicationRating: parseInt(e.target.value) })}>
                      {[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>{num} ⭐</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Class Experience Section */}
              <div className="form-section">
                <h4>🎓 Class Experience</h4>
                <div className="experience-grid">
                  <div>
                    <label>Your Class Attendance:</label>
                    <select value={reviewForm.classAttendance} onChange={(e) => setReviewForm({ ...reviewForm, classAttendance: e.target.value })}>
                      <option value="Regular">Regular (90%+)</option>
                      <option value="Sometimes">Sometimes (70-89%)</option>
                      <option value="Rarely">Rarely (&lt;70%)</option>
                    </select>
                  </div>
                  <div>
                    <label>Teacher's Punctuality:</label>
                    <select value={reviewForm.teacherPunctuality} onChange={(e) => setReviewForm({ ...reviewForm, teacherPunctuality: e.target.value })}>
                      <option value="Always On Time">Always On Time</option>
                      <option value="Usually On Time">Usually On Time</option>
                      <option value="Often Late">Often Late</option>
                      <option value="Always Late">Always Late</option>
                    </select>
                  </div>
                  <div>
                    <label>Teaching Method Quality:</label>
                    <select value={reviewForm.teachingMethod} onChange={(e) => setReviewForm({ ...reviewForm, teachingMethod: e.target.value })}>
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Average">Average</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>
                  <div>
                    <label>Use of Technology:</label>
                    <select value={reviewForm.useOfTechnology} onChange={(e) => setReviewForm({ ...reviewForm, useOfTechnology: e.target.value })}>
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Average">Average</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Course Details */}
              <div className="form-section">
                <h4>📚 Course Details</h4>
                <div className="course-grid">
                  <div>
                    <label>Subject/Course:</label>
                    <input
                      type="text"
                      value={reviewForm.subject}
                      onChange={(e) => setReviewForm({ ...reviewForm, subject: e.target.value })}
                      placeholder="e.g., Data Structures, Calculus I"
                      required
                    />
                  </div>
                  <div>
                    <label>Semester:</label>
                    <input
                      type="text"
                      value={reviewForm.semester}
                      onChange={(e) => setReviewForm({ ...reviewForm, semester: e.target.value })}
                      placeholder="e.g., Fall 2024, Spring 2025"
                      required
                    />
                  </div>
                  <div>
                    <label>Course Difficulty:</label>
                    <select value={reviewForm.difficulty} onChange={(e) => setReviewForm({ ...reviewForm, difficulty: e.target.value })}>
                      <option value="Very Easy">Very Easy</option>
                      <option value="Easy">Easy</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Hard">Hard</option>
                      <option value="Very Hard">Very Hard</option>
                    </select>
                  </div>
                  <div>
                    <label>Would Recommend:</label>
                    <select value={reviewForm.wouldRecommend} onChange={(e) => setReviewForm({ ...reviewForm, wouldRecommend: e.target.value === 'true' })}>
                      <option value="true">Yes, I'd recommend</option>
                      <option value="false">No, I wouldn't recommend</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div className="form-section">
                <h4>💬 Additional Comments</h4>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Share your detailed experience, teaching style, assignments, exams, etc..."
                  required
                  rows="4"
                  className="comment-textarea"
                />
              </div>

              <div className="form-buttons">
                <button type="submit" className="submit-btn">✅ Submit Review</button>
                <button type="button" onClick={() => setShowForm(false)} className="cancel-btn">❌ Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;