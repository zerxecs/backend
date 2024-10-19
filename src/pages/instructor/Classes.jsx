import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import personIcon from '../../media/person-icon.svg';
import '../../css/Classes.css';
import '../../css/CreateClass.css';

const Classes = ({ showPrivate }) => {
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // useNavigate hook

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

  // Filter classes based on the toggle state
  const displayedClasses = classes.filter(classItem => 
    (showPrivate && classItem.type === 'private') || 
    (!showPrivate && classItem.type === 'public')
  );

  return (
    <div id='classes' className="container">
      <main className="main-content">
        {error && <p className="error">{error}</p>}
        {displayedClasses.length === 0 && <p>No classes available.</p>}
        <div className="grid">
          {displayedClasses.map((classItem, index) => (
            <div
              className="card"
              key={index}
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

export default Classes;
