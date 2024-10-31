import React, { useEffect, useState } from 'react';
import '../css/incorrect_questions.css'; // Import the new CSS file

const IncorrectQuestions = ({ quizId }) => {
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);

  useEffect(() => {
    // Mock data for testing
    const mockData = [
      {
        questionId: 'q1',
        question: 'What is the capital of France?',
        choices: ['Paris', 'London', 'Berlin', 'Madrid'],
        correctAnswer: 'Paris',
        count: 5,
      },
      {
        questionId: 'q2',
        question: 'What is 2 + 2?',
        choices: ['3', '4', '5', '6'],
        correctAnswer: '4',
        count: 3,
      },
      {
        questionId: 'q3',
        question: 'What is the boiling point of water?',
        choices: ['90°C', '100°C', '110°C', '120°C'],
        correctAnswer: '100°C',
        count: 4,
      },
    ];

    // Simulate fetching data
    setTimeout(() => {
      setIncorrectQuestions(mockData);
    }, 1000);
  }, [quizId]);

  return (
    <div className="incorrect-questions">
      <h2>Top 3 Questions Where Most Students Got It Wrong</h2>
      <table>
        <thead>
          <tr>
            <th>Question</th>
            <th>Choices</th>
            <th>Correct Answer</th>
            <th>Number of Students Who Got It Wrong</th>
          </tr>
        </thead>
        <tbody>
          {incorrectQuestions.map(({ questionId, count, question, choices, correctAnswer }, index) => (
            <tr key={index}>
              <td>{question}</td>
              <td>
                <ul>
                  {choices.map((choice, idx) => (
                    <li key={idx}>{choice}</li>
                  ))}
                </ul>
              </td>
              <td>{correctAnswer}</td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IncorrectQuestions;