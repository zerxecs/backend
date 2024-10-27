import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import personIcon from '../../media/person-icon.svg';
import '../../css/Classes.css';
import '../../css/CreateClass.css';
import '../../css/studentClasses.css';
import StudentClassDetails from './StudentClassDetails'; // Import ClassDetails component

const StudentClasses = ({ showPrivate }) => {
  const [classes, setClasses] = useState([]); // All classes
  const [registeredClasses, setRegisteredClasses] = useState([]); // Registered private classes
  const [error, setError] = useState('');
  const [classCode, setClassCode] = useState(''); // State for class code input
  const [selectedClass, setSelectedClass] = useState(null); // State for selected class
  const navigate = useNavigate(); // useNavigate hook

  // Fetch all classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/classes', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          setClasses(data.classes);
        } else {
          setError(data.error || 'Error fetching classes');
        }

        // Fetch registered classes
        const registeredResponse = await fetch('http://localhost:5000/api/registered-classes', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const registeredData = await registeredResponse.json();
        if (registeredData.success) {
          setRegisteredClasses(registeredData.classes);
        } else {
          setError(registeredData.error || 'Error fetching registered classes');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('An error occurred while fetching classes.');
      }
    };

    fetchClasses();
  }, []);

  const handleRegisterClass = async () => {
    if (!classCode) {
      setError('Please enter a class code.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register-private-class', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ classCode }),
      });

      const data = await response.json();
      if (data.success) {
        setRegisteredClasses((prev) => [...prev, data.class]); // Add the newly registered class
        setClassCode(''); // Clear the input field
        setError(''); // Clear any previous errors
      } else {
        setError(data.error || 'Error registering for the class');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred while registering for the class.');
    }
  };

  const handleClassClick = (classId) => {
    navigate(`/class/${classId}`); // Navigate to class details page
  };

  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('');
  };

  const handleCardClick = (classItem) => {
    setSelectedClass(classItem);
  };

  const handleBackClick = () => {
    setSelectedClass(null);
  };

  // Filter registered classes based on the toggle state
  const displayedRegisteredClasses = registeredClasses.filter(classItem =>
    (showPrivate && classItem.type === 'private') ||
    (!showPrivate && classItem.type === 'public')
  );

  // Filter all classes based on the toggle state
  const displayedClasses = classes.filter(classItem =>
    (showPrivate && classItem.type === 'private') ||
    (!showPrivate && classItem.type === 'public')
  );

  if (selectedClass) {
    return <StudentClassDetails selectedClass={selectedClass} onBack={handleBackClick} />;
  }

  return (
    <div id='classes' className="main-content">
      {error && <p className="error">{error}</p>}
      
      <div className="section">
        <div className="join-class">
          <h2 className="colored regtext">Enter Class Code to Register for Private Class</h2>
          <div className="input-group">
            <input
              type="text"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              placeholder="Enter class code"
            />
            <button onClick={handleRegisterClass}>Register</button>
          </div>
        </div>
      </div>

    
      <div className="section">
        <h2 className="colored">{showPrivate ? 'Private' : 'Public'} Classes</h2>
        {displayedRegisteredClasses.length === 0 && <p className='no'>No registered classes available.</p>}
        <div className="grid">
          {displayedRegisteredClasses.map((classItem) => (
            <div
              className="card"
              key={classItem._id}
              onClick={() => handleClassClick(classItem._id)}
            >

              <div className="card-image-container">
                {getInitials(classItem.name)}
              </div>
              <div className="card-content">
                <h3 className="card-title">{classItem.name}</h3>
                <hr />
                <p>{classItem.description}</p>
                <p className="card-text">
                  <img src={personIcon} alt="Students Icon" className="icon-image" />
                  {classItem.students.length} Students Enrolled
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

StudentClasses.propTypes = {
  showPrivate: PropTypes.bool.isRequired,
};

export default StudentClasses;