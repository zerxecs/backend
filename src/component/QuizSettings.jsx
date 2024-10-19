import React, { useState } from 'react';
import './../css/settings_style.css';

import timerIcon from './../media/timer.svg';
import passingIcon from './../media/passing.svg';
import retryIcon from './../media/retry.svg';

const QuizSettings = () => {
  const [timeLimit, setTimeLimit] = useState({ hours: '', minutes: '', seconds: '' });
  const [deadline, setDeadline] = useState({ date: '', time: '' });
  const [passingScore, setPassingScore] = useState('');
  const [attemptsAllowed, setAttemptsAllowed] = useState('');
  const [options, setOptions] = useState({
    viewIncorrect: false,
    viewCorrect: false,
    viewPoints: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name in timeLimit) {
      setTimeLimit({ ...timeLimit, [name]: value });
    } else if (name in deadline) {
      setDeadline({ ...deadline, [name]: value });
    } else if (name === 'passingScore') {
      if (value === '' || (Number.isInteger(Number(value)) && Number(value) > 0)) {
        setPassingScore(value);
      }
    } else if (name === 'attemptsAllowed') {
      if (value === '' || (Number.isInteger(Number(value)) && Number(value) > 0)) {
        setAttemptsAllowed(value);
      }
    }
  };

  const handleOptionChange = (e) => {
    const { name, checked } = e.target;
    setOptions({ ...options, [name]: checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
  };

  return (
    <div id='quiz-setting'>
      <div className="settings-card">
        <h2 className="section-title">General</h2>
        <div className="input-group">
          <div className="title-wrapper">
            <img src={timerIcon} alt="Timer Icon" className="icon" />
            <label className="Category">Time Limit</label>
          </div>
          <div className="time-inputs">
            <input
              type="number"
              className="input-field"
              placeholder="Hours"
              name="hours"
              value={timeLimit.hours}
              onChange={handleInputChange}
            />
            <input
              type="number"
              className="input-field"
              placeholder="Minutes"
              name="minutes"
              value={timeLimit.minutes}
              onChange={handleInputChange}
            />
            <input
              type="number"
              className="input-field"
              placeholder="Seconds"
              name="seconds"
              value={timeLimit.seconds}
              onChange={handleInputChange}
            />
          </div>
          <p className="help-text">Set a time limit for completing the quiz or exam</p>
        </div>
        <div className="input-group">
          <label className="Subcategory">Deadline</label>
          <input
            type="date"
            className="input-field"
            name="date"
            value={deadline.date}
            onChange={handleInputChange}
          />
          <input
            type="time"
            className="input-field"
            name="time"
            value={deadline.time}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-group">
          <div className="title-wrapper">
            <img src={passingIcon} alt="Passing Icon" className="icon" />
            <label className="Category">Passing Score</label>
          </div>
          <input
            type="number"
            className="input-field"
            placeholder="score"
            name="passingScore"
            value={passingScore}
            onChange={handleInputChange}
            min="1"
          />
          <p className="help-text">Set the required score to pass the quiz or exam</p>
        </div>
        <div className="input-group">
          <div className="title-wrapper">
            <img src={retryIcon} alt="Retry Icon" className="icon" />
            <label className="Category">Attempts Allowed</label>
          </div>
          <input
            type="number"
            className="input-field"
            placeholder="points"
            name="attemptsAllowed"
            value={attemptsAllowed}
            onChange={handleInputChange}
            min="1"
          />
          <p className="help-text">Set the number of attempts each student is allowed to attempt.</p>
        </div>

        <h2 className="section-title">Respondents’</h2>
        <div className="options">
          <div className="option">
            <span className="description">Allow respondents to view which questions they answered incorrectly.</span>
            <label className="switch">
              <input
                type="checkbox"
                name="viewIncorrect"
                checked={options.viewIncorrect}
                onChange={handleOptionChange}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="option">
            <span className="description">Decide if respondents can view the correct answers once the grades are released.</span>
            <label className="switch">
              <input
                type="checkbox"
                name="viewCorrect"
                checked={options.viewCorrect}
                onChange={handleOptionChange}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="option">
            <span className="description">Select whether respondents can view the total possible points and the points they received for each question.</span>
            <label className="switch">
              <input
                type="checkbox"
                name="viewPoints"
                checked={options.viewPoints}
                onChange={handleOptionChange}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <button className="btn-save" onClick={handleSubmit}>Save</button>
      </div>
    </div>
  );
};

export default QuizSettings;