import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../css/performance_analysis.css'; // Import the new CSS file

const PerformanceAnalysis = ({ quizId }) => {
  const [performance, setPerformance] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const performanceResponse = await axios.get(`/api/quizzes/${quizId}/performance`);
        setPerformance(performanceResponse.data);

        const submissionsResponse = await axios.get(`/api/quizzes/${quizId}/submissions`);
        setResults(submissionsResponse.data);
      } catch (error) {
        console.error('Error fetching performance data:', error);
      }
    };

    fetchPerformanceData();
  }, [quizId]);

  if (!performance || results.length === 0) {
    return <div>Loading...</div>;
  }

  const correctAnswersCount = results.filter(result => result.isCorrect).length;
  const incorrectAnswersCount = results.filter(result => !result.isCorrect).length;
  const accuracy = ((performance.score / 100) * results.length).toFixed(2);

  // Calculate attempts, correct answers, and incorrect answers
  const attempts = results.length;
  const correctAnswers = correctAnswersCount;
  const incorrectAnswers = incorrectAnswersCount;

  return (
    <div className="performance-analysis-container">
      <div className="result-container">
        <div className="quiz-title-container">
          <h2>{performance.quizTitle}</h2>
          <p className="due-date">
            Due Date: {new Date(performance.dueDate).toLocaleString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric'
            })}
          </p>
        </div>
        <div className="quiz-summary">
          <h1>Quiz Summary</h1>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${accuracy}%` }} title={`${accuracy}%`}></div>
          </div>
          <table className="student-summary-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Submission Status</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td>{result.studentName}</td>
                  <td>{result.submissionStatus ? 'Submitted' : 'Not Submitted'}</td>
                  <td>{result.score} / {performance.totalPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="performance-analysis">
          <h1>Performance Analysis</h1>
          <table className="attempts-table">
            <thead>
              <tr>
                <th>Correct Answers</th>
                <th>Incorrect Answers</th>
                <th>Attempts</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{correctAnswers}</td>
                <td>{incorrectAnswers}</td>
                <td>{attempts}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="date-info-container">
          <h3>Date Information</h3>
          <table className="date-info-table">
            <thead>
              <tr>
                <th>Date Taken</th>
                <th>Date Submitted</th>
                <th>Time Finished</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td>{new Date(result.dateTaken).toLocaleString()}</td>
                  <td>{new Date(result.dateSubmitted).toLocaleString()}</td>
                  <td>{result.timeFinished}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="results-table-container">
          <h3>Results</h3>
          <table className="results-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Your Answer</th>
                <th>Correct Answer</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index} className={`result-item ${result.isCorrect ? 'correct' : 'wrong'}`}>
                  <td>{result.question}</td>
                  <td>{result.answer}</td>
                  <td>{result.correctAnswer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalysis;