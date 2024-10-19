import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import personIcon from '../../media/person-icon.svg';
import '../../css/Home.css';

const Home = ({ classes = [], onCardClick, setContent }) => {
  const [visibleCount, setVisibleCount] = useState(4);
  const navigate = useNavigate();

  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('');
  };

  return (
    <div id='home-instructor'  className="container">
      <main className="main-content">
        <div className="main-card">
          <h2 className="welcome-title">
            Welcome to class<span className="colored">iz</span>, <br /> <span className='name'>Nikki!</span> 
          </h2>
        </div>

        <div className="grid">
          {classes.slice(0, visibleCount).map((classItem, index) => (
            <div
              className="card"
              key={index}
              onClick={() => onCardClick(classItem)}
            >
              <div className="card-image-container">
                {getInitials(classItem.name)}
              </div>
              <div className="card-content">
                <h3 className="card-title">{classItem.name}</h3>
                <hr />
                <p className='card-description'>{classItem.description}</p>
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
          <a href="#" className="nav-link see-more-btn" onClick={() => setContent("Classes")}>
            see more
          </a>
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