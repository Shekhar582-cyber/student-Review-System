import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const AdminDashboard = () => {
  const [teachers, setTeachers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teacherForm, setTeacherForm] = useState({
    name: '',
    department: '',
    subject: '',
    email: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  useEffect(() => {
    fetchTeachers();
    fetchReviews();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/teachers');
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/reviews');
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchTeacherAnalytics = async (teacherId) => {
    setLoadingAnalytics(true);
    try {
      const response = await axios.get(`http://localhost:3001/api/teachers/${teacherId}/reviews`);
      const teacher = teachers.find(t => t._id === teacherId);
      
      // Handle both array format (fallback) and object format (with pagination)
      const reviews = Array.isArray(response.data) ? response.data : response.data.reviews || [];
      
      console.log('Fetched reviews for analytics:', reviews.length);
      
      // Calculate analytics
      const analytics = calculateTeacherAnalytics(reviews);
      setSelectedTeacher({ ...teacher, analytics, totalReviews: reviews.length });
    } catch (error) {
      console.error('Error fetching teacher analytics:', error);
      // Show error message to user
      const teacher = teachers.find(t => t._id === teacherId);
      setSelectedTeacher({ ...teacher, analytics: null, totalReviews: 0, error: error.message });
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const calculateTeacherAnalytics = (reviews) => {
    if (reviews.length === 0) return null;

    const totals = reviews.reduce((acc, review) => {
      acc.overallRating += review.overallRating;
      acc.teachingMethodRating += review.teachingMethodRating;
      acc.punctualityRating += review.punctualityRating;
      acc.knowledgeRating += review.knowledgeRating;
      acc.communicationRating += review.communicationRating;
      acc.recommendations += review.wouldRecommend ? 1 : 0;
      
      // Count difficulty levels
      acc.difficulty[review.difficulty] = (acc.difficulty[review.difficulty] || 0) + 1;
      
      // Count teaching methods
      acc.teachingMethods[review.teachingMethod] = (acc.teachingMethods[review.teachingMethod] || 0) + 1;
      
      // Count class attendance
      acc.classAttendance[review.classAttendance] = (acc.classAttendance[review.classAttendance] || 0) + 1;
      
      return acc;
    }, {
      overallRating: 0,
      teachingMethodRating: 0,
      punctualityRating: 0,
      knowledgeRating: 0,
      communicationRating: 0,
      recommendations: 0,
      difficulty: {},
      teachingMethods: {},
      classAttendance: {}
    });

    const count = reviews.length;
    
    return {
      averageRatings: {
        overall: (totals.overallRating / count).toFixed(1),
        teachingMethod: (totals.teachingMethodRating / count).toFixed(1),
        punctuality: (totals.punctualityRating / count).toFixed(1),
        knowledge: (totals.knowledgeRating / count).toFixed(1),
        communication: (totals.communicationRating / count).toFixed(1)
      },
      recommendationRate: ((totals.recommendations / count) * 100).toFixed(1),
      difficultyDistribution: totals.difficulty,
      teachingMethodDistribution: totals.teachingMethods,
      classAttendanceDistribution: totals.classAttendance,
      totalReviews: count
    };
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/teachers', teacherForm);
      alert('Teacher added successfully!');
      setShowAddForm(false);
      setTeacherForm({ name: '', department: '', subject: '', email: '' });
      fetchTeachers();
    } catch (error) {
      alert('Error adding teacher');
    }
  };

  const getStrongestArea = (ratings) => {
    const areas = {
      teachingMethod: 'Teaching Method',
      punctuality: 'Punctuality',
      knowledge: 'Subject Knowledge',
      communication: 'Communication Skills'
    };
    
    const highest = Object.entries(ratings)
      .filter(([key]) => key !== 'overall')
      .reduce((max, [key, value]) => parseFloat(value) > parseFloat(max[1]) ? [key, value] : max);
    
    return `${areas[highest[0]]} (${highest[1]}/5)`;
  };

  const getWeakestArea = (ratings) => {
    const areas = {
      teachingMethod: 'Teaching Method',
      punctuality: 'Punctuality',
      knowledge: 'Subject Knowledge',
      communication: 'Communication Skills'
    };
    
    const lowest = Object.entries(ratings)
      .filter(([key]) => key !== 'overall')
      .reduce((min, [key, value]) => parseFloat(value) < parseFloat(min[1]) ? [key, value] : min);
    
    return `${areas[lowest[0]]} (${lowest[1]}/5)`;
  };

  return (
    <div className="dashboard">
      <h2>Admin Dashboard</h2>
      
      <div className="admin-stats">
        <div className="stat-card">
          <h3>{teachers.length}</h3>
          <p>Total Teachers</p>
        </div>
        <div className="stat-card">
          <h3>{reviews.length}</h3>
          <p>Total Reviews</p>
        </div>
      </div>

      <div className="admin-section">
        <div className="section-header">
          <h3>Teachers Management</h3>
          <button onClick={() => setShowAddForm(true)} className="add-btn">Add Teacher</button>
        </div>
        
        <div className="teachers-list">
          {teachers.map(teacher => (
            <div key={teacher._id} className="teacher-item">
              <div className="teacher-info">
                <h4>{teacher.name}</h4>
                <p>{teacher.department}{teacher.subject ? ` - ${teacher.subject}` : ''}</p>
                <p>Rating: {teacher.averageRating.toFixed(1)}/5 ({teacher.totalReviews} reviews)</p>
              </div>
              <button 
                onClick={() => fetchTeacherAnalytics(teacher._id)}
                className="view-analytics-btn"
                disabled={loadingAnalytics}
              >
                {loadingAnalytics ? 'Loading...' : 'View Analytics'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedTeacher && selectedTeacher.analytics && (
        <div className="modal">
          <div className="modal-content large">
            <h3>📊 Performance Analytics - {selectedTeacher.name}</h3>
            
            <div className="analytics-overview">
              <div className="analytics-header">
                <div className="teacher-summary">
                  <h4>{selectedTeacher.name}</h4>
                  <p>{selectedTeacher.department}{selectedTeacher.subject ? ` - ${selectedTeacher.subject}` : ''}</p>
                  <p className="total-reviews">Based on {selectedTeacher.analytics.totalReviews} student reviews</p>
                </div>
                <div className="recommendation-rate">
                  <div className="rate-circle">
                    <span className="rate-number">{selectedTeacher.analytics.recommendationRate}%</span>
                    <span className="rate-label">Recommend</span>
                  </div>
                </div>
              </div>

              <div className="ratings-grid">
                <div className="rating-card">
                  <h5>⭐ Overall Rating</h5>
                  <div className="rating-value">{selectedTeacher.analytics.averageRatings.overall}/5</div>
                </div>
                <div className="rating-card">
                  <h5>📚 Teaching Method</h5>
                  <div className="rating-value">{selectedTeacher.analytics.averageRatings.teachingMethod}/5</div>
                </div>
                <div className="rating-card">
                  <h5>⏰ Punctuality</h5>
                  <div className="rating-value">{selectedTeacher.analytics.averageRatings.punctuality}/5</div>
                </div>
                <div className="rating-card">
                  <h5>🧠 Knowledge</h5>
                  <div className="rating-value">{selectedTeacher.analytics.averageRatings.knowledge}/5</div>
                </div>
                <div className="rating-card">
                  <h5>💬 Communication</h5>
                  <div className="rating-value">{selectedTeacher.analytics.averageRatings.communication}/5</div>
                </div>
              </div>

              <div className="distribution-section">
                <div className="distribution-card">
                  <h5>🎯 Course Difficulty Distribution</h5>
                  <div className="distribution-items">
                    {Object.entries(selectedTeacher.analytics.difficultyDistribution).map(([level, count]) => (
                      <div key={level} className="distribution-item">
                        <span className="label">{level}:</span>
                        <span className="count">{count} reviews</span>
                        <div className="bar">
                          <div 
                            className="bar-fill" 
                            style={{width: `${(count / selectedTeacher.analytics.totalReviews) * 100}%`}}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="distribution-card">
                  <h5>📖 Teaching Method Quality</h5>
                  <div className="distribution-items">
                    {Object.entries(selectedTeacher.analytics.teachingMethodDistribution).map(([method, count]) => (
                      <div key={method} className="distribution-item">
                        <span className="label">{method}:</span>
                        <span className="count">{count} reviews</span>
                        <div className="bar">
                          <div 
                            className="bar-fill" 
                            style={{width: `${(count / selectedTeacher.analytics.totalReviews) * 100}%`}}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="distribution-card">
                  <h5>📅 Class Attendance Pattern</h5>
                  <div className="distribution-items">
                    {Object.entries(selectedTeacher.analytics.classAttendanceDistribution).map(([attendance, count]) => (
                      <div key={attendance} className="distribution-item">
                        <span className="label">{attendance}:</span>
                        <span className="count">{count} reviews</span>
                        <div className="bar">
                          <div 
                            className="bar-fill" 
                            style={{width: `${(count / selectedTeacher.analytics.totalReviews) * 100}%`}}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="performance-insights">
                <h5>🔍 Performance Insights</h5>
                <div className="insights-grid">
                  <div className="insight-item">
                    <span className="insight-icon">🏆</span>
                    <div className="insight-content">
                      <strong>Strongest Area:</strong>
                      <p>{getStrongestArea(selectedTeacher.analytics.averageRatings)}</p>
                    </div>
                  </div>
                  <div className="insight-item">
                    <span className="insight-icon">📈</span>
                    <div className="insight-content">
                      <strong>Improvement Area:</strong>
                      <p>{getWeakestArea(selectedTeacher.analytics.averageRatings)}</p>
                    </div>
                  </div>
                  <div className="insight-item">
                    <span className="insight-icon">👥</span>
                    <div className="insight-content">
                      <strong>Student Satisfaction:</strong>
                      <p>{selectedTeacher.analytics.recommendationRate >= 80 ? 'Excellent' : 
                          selectedTeacher.analytics.recommendationRate >= 60 ? 'Good' : 'Needs Improvement'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <button onClick={() => setSelectedTeacher(null)} className="close-btn">Close Analytics</button>
          </div>
        </div>
      )}

      {selectedTeacher && !selectedTeacher.analytics && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedTeacher.error ? 'Error Loading Analytics' : 'No Reviews Available'}</h3>
            <p>
              {selectedTeacher.error 
                ? `Error: ${selectedTeacher.error}` 
                : "This teacher hasn't received any reviews yet."
              }
            </p>
            <button onClick={() => setSelectedTeacher(null)}>Close</button>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Teacher</h3>
            <form onSubmit={handleAddTeacher}>
              <input
                type="text"
                placeholder="Teacher Name"
                value={teacherForm.name}
                onChange={(e) => setTeacherForm({...teacherForm, name: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Department"
                value={teacherForm.department}
                onChange={(e) => setTeacherForm({...teacherForm, department: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Subject (Optional)"
                value={teacherForm.subject}
                onChange={(e) => setTeacherForm({...teacherForm, subject: e.target.value})}
              />
              <input
                type="email"
                placeholder="Email"
                value={teacherForm.email}
                onChange={(e) => setTeacherForm({...teacherForm, email: e.target.value})}
                required
              />
              <div className="form-buttons">
                <button type="submit">Add Teacher</button>
                <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;