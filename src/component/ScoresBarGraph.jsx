import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import '../css/scores_bar_graph.css'; // Import the new CSS file

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ScoresBarGraph = ({ quizId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Mock data for testing
    const mockData = [
      { userName: 'Student 1', score: 0.85 },
      { userName: 'Student 2', score: 0.90 },
      { userName: 'Student 3', score: 0.75 },
      { userName: 'Student 4', score: 0.80 },
      { userName: 'Student 5', score: 0.95 },
      { userName: 'Student 6', score: 0.70 },
      { userName: 'Student 7', score: 0.65 },
      { userName: 'Student 8', score: 0.88 },
      { userName: 'Student 9', score: 0.92 },
      { userName: 'Student 10', score: 0.78 },
    ];
    setSubmissions(mockData);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 5, submissions.length - 5));
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 5, 0));
  };

  const data = {
    labels: submissions.slice(currentIndex, currentIndex + 5).map(submission => submission.userName),
    datasets: [
      {
        label: 'Scores (%)',
        data: submissions.slice(currentIndex, currentIndex + 5).map(submission => (submission.score * 100).toFixed(2)),
        backgroundColor: '#7E57C2', // Bar color
      },
    ],
  };

  return (
    <div className="chart-container">
      <Bar data={data} />
      <div className="navigation-buttons">
        <button onClick={handlePrev} disabled={currentIndex === 0}>Previous</button>
        <button onClick={handleNext} disabled={currentIndex >= submissions.length - 5}>Next</button>
      </div>
    </div>
  );
};

export default ScoresBarGraph;