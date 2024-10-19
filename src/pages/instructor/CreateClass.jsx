import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../../css/CreateClass.css';
import publicIcon from '../../assets/chat-text-dynamic-gradient.svg';
import privateIcon from '../../assets/lock-dynamic-gradient.svg';

const CreateClass = ({ addClass }) => {
  const [className, setClassName] = useState('');
  const [classDescription, setClassDescription] = useState('');
  const [classType, setClassType] = useState('private');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); 
    if (e.target.checkValidity()) {
      const newClass = {
        name: className,
        description: classDescription,
        type: classType,
        additionalInfo, 
      };
      addClass(newClass);
      setClassName('');
      setClassDescription('');
      setClassType('private');
      setAdditionalInfo(''); 
    }
  };

  return (
    <div id='create-class'>
      <h1>Fill up the form to create a class.</h1>
      <form onSubmit={handleSubmit} className="create-class-container" noValidate>
        <div className="form-group">
          <label htmlFor="className">Class Name</label>
          <input
            type="text"
            id="className"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Enter class name"
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="classDescription">Class Description</label>
          <textarea
            id="classDescription"
            value={classDescription}
            onChange={(e) => setClassDescription(e.target.value)}
            placeholder="Enter class description"
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Class Type</label>
          <div className="btn-group">
            <button
              type="button"
              className={`btn ${classType === 'private' ? 'btn-primary btn-selected' : 'btn-outline-primary'}`}
              onClick={() => setClassType('private')}
            >
              <img src={privateIcon} alt="Private Icon" className="btn-icon" />
              <div className="btn-text">
                Private
                <span className="btn-subtext">People need permission to join</span>
              </div>
            </button>
            <button
              type="button"
              className={`btn ${classType === 'public' ? 'btn-primary btn-selected' : 'btn-outline-primary'}`}
              onClick={() => setClassType('public')}
            >
              <img src={publicIcon} alt="Public Icon" className="btn-icon" />
              <div className="btn-text">
                Public
                <span className="btn-subtext">Anyone can join</span>
              </div>
            </button>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="additionalInfo">Type a name or email that you want to add to this class</label>
          <input
            type="text"
            id="additionalInfo"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="Enter name or email"
            className="form-control"
          />
        </div>
        <button type="submit" className="center-btn">Add Class</button>
      </form>
    </div>
  );
};

CreateClass.propTypes = {
  addClass: PropTypes.func.isRequired,
};

export default CreateClass;