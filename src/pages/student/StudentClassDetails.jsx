import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import personIcon from '../../media/person-icon.svg';
import backIcon from '../../media/back.svg';
import settingsIcon from '../../media/settings.svg';
import activityIcon from '../../media/activity.svg';
import quizIcon from '../../media/quiz.svg';
import examIcon from '../../media/exam.svg';
import '../../css/class_content.css';
import StudentClassQuizzes from './StudentClassQuizzes'; // Import ClassQuizzes

const ClassDetails = ({ selectedClass, onBack }) => {
  const [registeredStudents, setRegisteredStudents] = useState(selectedClass.students);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showQuizzes, setShowQuizzes] = useState(false); // State for showing quizzes

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (!term) {
      setFilteredStudents([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/students`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        const results = data.students.filter(student =>
          `${student.fname} ${student.lname}`.toLowerCase().includes(term.toLowerCase()) ||
          student.email.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredStudents(results);
      } else {
        setError(data.error || 'Error fetching student search results');
      }
    } catch (err) {
      console.error('Error searching students:', err);
      setError('An error occurred while searching students.');
    }
  };

  const handleSelectStudent = (student) => {
    if (!students.some(s => s.email === student.email)) {
      setStudents([...students, student]);
    }
    setFilteredStudents([]);
    setSearchTerm('');
  };

  const handleRemoveStudent = (email) => {
    setStudents(students.filter(student => student.email !== email));
  };

  const handleRemoveStudentFromClass = async (studentEmail) => {
    try {
      const response = await fetch(`http://localhost:5000/api/class/${selectedClass._id}/remove-student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ email: studentEmail }),
      });

      const data = await response.json();
      if (data.success) {
        setRegisteredStudents(data.class.students);
      } else {
        setError(data.error || 'Error removing student');
      }
    } catch (err) {
      console.error('Error removing student:', err);
      setError('An error occurred while removing student.');
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (students.length === 0) {
      setError('No students selected.');
      return;
    }

    const emails = students.map(student => student.email);

    try {
      const response = await fetch(`http://localhost:5000/api/class/${selectedClass._id}/add-students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ emails }),
      });

      const data = await response.json();
      if (data.success) {
        setRegisteredStudents(data.class.students);
        setStudents([]);
      } else {
        setError(data.error || 'Error adding students');
      }
    } catch (err) {
      console.error('Error adding student:', err);
      setError('An error occurred while adding students.');
    }
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleShowQuizzes = () => {
    setShowQuizzes(true);
  };

  const handleBackFromQuizzes = () => {
    setShowQuizzes(false);
  };

  return (
    <div id="class-details"  >
        {error && <p className="error">{error}</p>}
        {selectedClass && (
          <>
            {showQuizzes ? (
              <StudentClassQuizzes selectedClass={selectedClass} onBack={handleBackFromQuizzes} />
            ) : (
              <>
                <div id="class-details" className="header-content">
                  <button className="back-btn" onClick={onBack}>
                    <img src={backIcon} alt="Back Icon" />
                  </button>
                  <div className="title-container">
                    <div className="title-row">
                      <h1 className="title">{selectedClass.name}</h1>
                      <button className="settings-btn" onClick={toggleSettings}>
                        <img src={settingsIcon} alt="Settings Icon" />
                      </button>
                    </div>
                    <hr className="divider" />
                    <p className="description"><strong>Description:</strong> {selectedClass.description}</p>
                    {selectedClass.type === 'private' ? (
                      <p className="class-code"><strong>Class Code:</strong> {selectedClass.code}</p>
                    ) : (
                      <p className="class-code"><strong>Class Type:</strong> Public</p>
                    )}
                  </div>
                </div>
                {!showSettings && (
                  <>
                    <div className="assessments">
                      <h2 className="subheading">PRIVATE ASSESSMENTS</h2>
                      <div className="assessment-list">
                        <button className="assessment-btn" onClick={handleShowQuizzes}>
                          <img src={quizIcon} alt="Quiz Icon" className="quiz-icon" /> Quizzes
                        </button>
                        <button className="assessment-btn">
                          <img src={examIcon} alt="Exam Icon" className="exam-icon" /> Exams
                        </button>
                      </div>
                    </div>
                  </>
                )}
                {showSettings && (
                  <div id="class-details" className="settings-section">
                    <div className="join-class">
                      <h3 className="colored regtext">Add Student</h3>
                      <form onSubmit={handleAddStudent}>
                        <div className="form-group">
                          <label htmlFor="searchTerm">Search for a student</label>
                          <input
                            type="text"
                            id="searchTerm"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Enter name or email"
                            className="cd-input-group"
                          />
                          {filteredStudents.length > 0 && (
                            <ul className="student-search-results">
                              {filteredStudents.map(student => (
                                <li key={student._id} onClick={() => handleSelectStudent(student)}>
                                  {`${student.fname} ${student.lname} (${student.email})`}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div className="selected-students">
                          {students.map(student => (
                            <div key={student.email} className="selected-student">
                              <span>{`${student.fname} ${student.lname}`}</span>
                              <button type="button" onClick={() => handleRemoveStudent(student.email)}>
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                        <button type="submit" className="center-btn">Add Students to Class</button>
                      </form>

                      <div>
                    <h3 className="colored regtext">Enrolled Students</h3>
            
                  </div>
                    </div>
                    <button className="back-to-classdeets" onClick={toggleSettings}>Back to Class Details</button>
                  </div>
                )}
              </>
            )}
          </>
        )}
    </div>
  );
};

ClassDetails.propTypes = {
  selectedClass: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default ClassDetails;