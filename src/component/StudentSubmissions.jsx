import React, { useEffect, useState } from 'react';
import '../css/student_submissions.css';

const StudentSubmissions = ({ quizId }) => {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    // Mock data for testing
    const mockData = [
      { userName: 'Student 1', score: 0.85, submittedAt: new Date() },
      { userName: 'Student 2', score: 0.90, submittedAt: new Date() },
      { userName: 'Student 3', score: 0.75, submittedAt: new Date() },
      { userName: 'Student 4', score: 0.80, submittedAt: new Date() },
      { userName: 'Student 5', score: 0.95, submittedAt: new Date() },
      { userName: 'Student 6', score: 0.70, submittedAt: new Date() },
      { userName: 'Student 7', score: 0.65, submittedAt: new Date() },
      { userName: 'Student 8', score: 0.88, submittedAt: new Date() },
      { userName: 'Student 9', score: 0.92, submittedAt: new Date() },
      { userName: 'Student 10', score: 0.78, submittedAt: new Date() },
    ];
    setSubmissions(mockData);
  }, []);

  return (
    <div className="student-submissions">
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
          {submissions.map((submission, index) => (
            <tr key={index}>
              <td>{submission.userName}</td>
              <td>{new Date(submission.submittedAt).toLocaleString()}</td>
              <td>{(submission.score * 100).toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentSubmissions;