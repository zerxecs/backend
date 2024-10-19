import React, { useState } from 'react';
import PropTypes from 'prop-types';
import QuizQuestions from '../../component/QuizQuestions';
import QuizSettings from '../../component/QuizSettings';
import questionIcon from './../../media/question.svg';
import settingsIcon from './../../media/settings.svg';
import previewIcon from './../../media/preview.svg';
import editIcon from './../../media/edit.svg';
import backIcon from './../../media/back.svg';

import '../../css/CreateActivity.css';
import '../../css/settings_style.css';

const CreateActivity = ({ onBackClick }) => {
  const [activeComponent, setActiveComponent] = useState('questions');

  return (
    <div id='create-activity'>     
      <div className="btn-group">
         <button className="back-btn" onClick={onBackClick}>
          <img src={backIcon} alt="Back Icon" />
        </button>
        <button className="btn-primary" onClick={() => setActiveComponent('questions')}>
          <img src={questionIcon} alt="Question Icon" className="btn-primary-icon" />
          Questions
        </button>
        <button className="btn-primary" onClick={() => setActiveComponent('settings')}>
          <img src={settingsIcon} alt="Settings Icon" className="btn-primary-icon" />
          Settings
        </button>
      </div>
      <div className="icon-group">
        <button className="btn-icon-preview">
          <img src={previewIcon} alt="Eye Icon" />
        </button>
        <button className="btn-icon-edit">
          <img src={editIcon} alt="Edit Icon" />
        </button>
      </div>
      <div className="main-content">
        {activeComponent === 'questions' && <QuizQuestions />}
        {activeComponent === 'settings' && <QuizSettings />}
      </div>
    </div>
  );
};

CreateActivity.propTypes = {
  onBackClick: PropTypes.func.isRequired,
};

export default CreateActivity;