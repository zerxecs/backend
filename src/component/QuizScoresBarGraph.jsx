import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import '../css/scores_bar_graph.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const QuizScoresBarGraph = ({ submissions, registeredStudents }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const studentsPerPage = 15;

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + studentsPerPage, submissions.length - studentsPerPage));
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - studentsPerPage, 0));
  };

  const getStudentName = (email) => {
    const student = registeredStudents.find(student => student.email === email);
    return student ? `${student.fname} ${student.lname}` : email;
  };

  const data = {
    labels: submissions.slice(currentIndex, currentIndex + studentsPerPage).map(submission => getStudentName(submission.userEmail)),
    datasets: [
      {
        label: 'Scores',
        data: submissions.slice(currentIndex, currentIndex + studentsPerPage).map(submission => (submission.score).toFixed(2)),
        backgroundColor: '#7E57C2', 
      },
    ],
  };

  return (
    <div className="chart-container">
      <h2>Scores Bar Graph</h2>
      <Bar data={data} />
      <div className="navigation-buttons">
        <button onClick={handlePrev} disabled={currentIndex === 0}>Previous</button>
        <button onClick={handleNext} disabled={currentIndex >= submissions.length - studentsPerPage}>Next</button>
      </div>
    </div>
  );
};

export default QuizScoresBarGraph;