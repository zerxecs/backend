import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import personIcon from '../../media/person-icon.svg';
import '../../css/Classes.css';

const StudentClasses = () => {
  const [classes, setClasses] = useState([]); // All public classes
  const [registeredClasses, setRegisteredClasses] = useState([]); // Registered private classes
  const [error, setError] = useState('');
  const [classCode, setClassCode] = useState(''); // State for class code input
  const navigate = useNavigate(); // useNavigate hook

  // Fetch all public classes and registered private classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        // Fetch public classes
        const publicResponse = await fetch('http://localhost:5000/api/public-classes', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const publicData = await publicResponse.json();
        if (publicData.success) {
          setClasses(publicData.classes);
        } else {
          setError(publicData.error || 'Error fetching public classes');
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

  const handleClassClick = (classId) => {
    navigate(`/class/${classId}`); // Navigate to class details page
  };

  // Handle class registration by class code
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

  return (
    <div id='classes' className="container">
      <main className="main-content">
        {error && <p className="error">{error}</p>}
        
        <h2>Enter Class Code to Register for Private Class</h2>
        <div className="register-class">
          <input
            type="text"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            placeholder="Enter class code"
          />
          <button onClick={handleRegisterClass}>Register</button>
        </div>

        <h2>Public Classes</h2>
        {classes.length === 0 && <p>No public classes available.</p>}
        <div className="grid">
          {classes.map((classItem) => (
            <div
              className="card"
              key={classItem._id}
              onClick={() => handleClassClick(classItem._id)}
            >
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

        <h2>Registered Private Classes</h2>
        {registeredClasses.length === 0 && <p>No registered classes available.</p>}
        <div className="grid">
          {registeredClasses.map((classItem) => (
            <div
              className="card"
              key={classItem._id}
              onClick={() => handleClassClick(classItem._id)}
            >
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
      </main>
    </div>
  );
};

export default StudentClasses;
