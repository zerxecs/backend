import axios from 'axios';
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
import { useParams } from 'react-router-dom';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const PerformanceAnalysis = () => {
    const { submissionId } = useParams();
    const [performance, setPerformance] = useState(null);
    const [score, setScore] = useState(0);
    const [results, setResults] = useState([]);
    const [passingPercentage, setPassingPercentage] = useState(50); // Example passing percentage

    useEffect(() => {
        const fetchPerformance = async () => {
            try {
                const response = await axios.get(`/api/performance/${submissionId}`);
                setPerformance(response.data);
                const newResults = response.data.questions.map((q, index) => ({
                    question: q.question,
                    correctAnswer: q.correctAnswer,
                    givenAnswer: q.givenAnswer,
                    isCorrect: q.isCorrect
                }));
                const newScore = response.data.score;
                setResults(newResults);
                setScore(newScore);
            } catch (error) {
                console.error('Error fetching performance analysis:', error);
            }
        };

        fetchPerformance();
    }, [submissionId]);

    if (!performance) {
        return <div>Loading...</div>;
    }

    const data = {
        labels: results.map((result, index) => `Q${index + 1}`),
        datasets: [
            {
                label: 'Correct',
                data: results.map(result => (result.isCorrect ? 1 : 0)),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: 'Incorrect',
                data: results.map(result => (!result.isCorrect ? 1 : 0)),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
        ],
    };

    return (
        <div>
            <h2>{performance.quizTitle}</h2>
            <div className="result-container">
                <h1>Performance Analysis</h1>
                <p>Score: {performance.score}</p>
                <p>Accuracy: {((performance.score / 100) * results.length).toFixed(2)}%</p>
                <p>Correct Answers: {results.filter(result => result.isCorrect).length}</p>
                <p>Incorrect Answers: {results.filter(result => !result.isCorrect).length}</p>
                <Bar data={data} />
                <h3>Results</h3>
                <p className="result-summary">Score: {score}%</p>
                <p className="result-summary">Passing Percentage: {passingPercentage}%</p>
                <ul>
                    {results.map((result, index) => (
                        <li key={index} className={`result-item ${result.isCorrect ? 'correct' : 'wrong'}`}>
                            <p><strong>Question:</strong> {result.question}</p>
                            <p><strong>Correct Answer:</strong> {result.correctAnswer}</p>
                            <p><strong>Your Answer:</strong> {result.givenAnswer}</p>
                            <p>{result.isCorrect ? 'Correct' : 'Wrong'}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PerformanceAnalysis;