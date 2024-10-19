import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import personIcon from '../../media/person-icon.svg';
import '../../css/Home.css';

const Home = ({ classes = [], onCardClick, setContent }) => {
  const [visibleCount, setVisibleCount] = useState(4);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  // Fetch user details to get the email
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Pass the token
          },
        });

        const data = await response.json();
        
        if (data.success) {
          setUser(data.user); // Store user data (including email)
        } else {
          setError(data.error || 'Error fetching user details');
        }
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('An error occurred while fetching user details.');
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <div id='home-user' className="container">
      <main className="main-content">
        <div className="main-card">
          {error && <p className="error">{error}</p>}
          <h2 className="welcome-title">
            Welcome to class<span className="colored">iz</span>, <br />
            <span className='name'>
              {user ? user.fname : 'User'}!
            </span> {/* Display the email if fetched, otherwise display 'User' */}
          </h2>
        </div>

        <div className="grid">
          {classes.slice(0, visibleCount).map((classItem, index) => (
            <div
              className="card"
              key={index}
              onClick={() => onCardClick(classItem)}
            >
              <div className="card-content">
                <h3 className="card-title">{classItem.name}</h3>
                <hr />
                <p>{classItem.description}</p>
                <p className="card-text">
                  <img
                    src={personIcon}
                    alt="Students Icon"
                    className="icon-image"
                  />
                  {classItem.enrollment} Students Enrolled
                </p>
              </div>
            </div>
          ))}
        </div>
        {visibleCount < classes.length && (
          <button className="nav-link see-more-btn" onClick={() => setContent("Classes")}>
            see more
          </button>
        )}
      </main>
    </div>
  );
};

Home.propTypes = {
  classes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      enrollment: PropTypes.number.isRequired,
    })
  ).isRequired,
  onCardClick: PropTypes.func.isRequired,
  setContent: PropTypes.func.isRequired, 
};

export default Home;
