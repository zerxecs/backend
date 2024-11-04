import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../css/quiz_results.css'; // Import the new CSS file
import performanceIcon from '../media/performance.svg';
import IncorrectQuestions from './IncorrectQuestions';
import ScoresBarGraph from './ScoresBarGraph';
import StudentSubmissions from './StudentSubmissions';

const QuizResults = ({ quizId }) => {
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

  if (!quiz) {
    return <div>Loading...</div>;
  }

  return (
    <div className="performance-container">
      <div className="quiz-wrapper">
        <div className="details-wrapper">
          <h1 className="quiz-title">{quiz.quiz_title}</h1>
          <hr />
          <div className="date-wrapper">
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
        <div className="performance-header">
          <img src={performanceIcon} alt="Performance Overview" className="performance-icon" />
          <h2>Performance Overview</h2>
        </div>
        <div className="chart">
          <ScoresBarGraph quizId={quizId} />
        </div>
        <IncorrectQuestions quizId={quizId} />
      </div>

      <div className="student-list">
        <StudentSubmissions quizId={quizId} />
      </div>
    </div>
  );
};

export default QuizResults;