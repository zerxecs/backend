import axios from 'axios';
import React, { useEffect, useState } from 'react';
import drawBarChart from '../../component/performance_chart';
import '../../css/performance_overview.css';
import calendarIcon from '../../media/calendar.svg';
import performanceIcon from '../../media/performance.svg';
import IncorrectQuestions from './IncorrectQuestions'; // Import IncorrectQuestions component
import ScoresBarGraph from './ScoresBarGraph'; // Import ScoresBarGraph component
import StudentSubmissions from './StudentSubmissions'; // Import StudentSubmissions component

const PerformanceOverview = ({ quizId }) => {
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get(`/api/quizzes/${quizId}`);
        setQuiz(response.data);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };

    fetchQuizData();
  }, [quizId]);

  useEffect(() => {
    const canvas = document.getElementById('performanceChart');
    if (canvas) {
      drawBarChart(canvas);
    }
  }, [quiz]);

  if (!quiz) {
    return <div>Loading...</div>;
  }

  return (
    <div id='instructor-performance-ov' className="perfomance-container">
      <div className="quiz-wrapper">
        <div className="details-wrapper">
          <h1 className="quiz-title">{quiz.quiz_title}</h1>
          <hr />
          <div className="date-wrapper">
            <img src={calendarIcon} alt="Calendar Icon" className="image icon" />
            <p className="due-date">
              Due Date: {new Date(quiz.due_date).toLocaleString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="performance-overview">
        <div className="image-wrapper">
          <img src={performanceIcon} alt="Performance Overview" className="performance-icon" />
          <h2>Performance Overview</h2>
        </div>
        <div className="chart">
          <canvas id="performanceChart" width="600" height="400"></canvas>
        </div>
        <ScoresBarGraph quizId={quizId} /> {/* Integrate ScoresBarGraph */}
        <IncorrectQuestions quizId={quizId} /> {/* Integrate IncorrectQuestions */}
      </div>

      <StudentSubmissions quizId={quizId} /> {/* Integrate StudentSubmissions */}
    </div>
  );
};

export default PerformanceOverview;