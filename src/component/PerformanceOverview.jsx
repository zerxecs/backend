import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../css/performance_overview.css';
import IncorrectQuestions from './IncorrectQuestions'; // Import IncorrectQuestions component
import ScoresBarGraph from './ScoresBarGraph'; // Import ScoresBarGraph component

const PerformanceOverview = ({ quizId }) => {
  const [students, setStudents] = useState([]);
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get(`/api/quizzes/${quizId}`);
        console.log('Quiz data:', response.data); // Debugging log
        setQuiz(response.data);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await axios.get(`/api/quiz/${quizId}/submissions`);
        console.log('Student submissions:', response.data); // Debugging log
        setStudents(response.data.submissions);
      } catch (error) {
        console.error('Error fetching student submissions:', error);
      }
    };

    fetchQuizData();
    fetchStudents();
  }, [quizId]);

  if (!quiz) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="quiz-wrapper">
        <div className="details-wrapper">
          <h1 className="quiz-title">{quiz.quiz_title}</h1>
          <hr />
          <div className="date-wrapper">
            <img src="media/calendar.svg" alt="Calendar Icon" className="image icon" />
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
        <ScoresBarGraph quizId={quizId} /> {/* Integrate ScoresBarGraph */}
        <IncorrectQuestions quizId={quizId} /> {/* Integrate IncorrectQuestions */}
      </div>

      <div className="student-list">
        <h2>Student Submissions</h2>
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Submission Time</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                <td>{student.userEmail}</td>
                <td>{new Date(student.submittedAt).toLocaleString()}</td>
                <td>{student.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PerformanceOverview;