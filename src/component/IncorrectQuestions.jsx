import axios from 'axios';
import React, { useEffect, useState } from 'react';

const IncorrectQuestions = ({ quizId }) => {
    const [incorrectQuestions, setIncorrectQuestions] = useState([]);

    useEffect(() => {
        const fetchIncorrectQuestions = async () => {
            try {
                const response = await axios.get(`/api/quizzes/${quizId}/incorrect-questions`);
                setIncorrectQuestions(response.data);
            } catch (error) {
                console.error('Error fetching incorrect questions:', error);
            }
        };

        fetchIncorrectQuestions();
    }, [quizId]);

    return (
        <div>
            <br></br>
            <h2>Questions where most people them wrong.</h2>
            <ul>
                {incorrectQuestions.map(([questionId, count], index) => (
                    <li key={index}>
                        Question ID: {questionId}, Incorrect Count: {count}
                    </li>
                ))}
            </ul>
        </div>
    );
};

IncorrectQuestions.propTypes = {
  incorrectQuestions: PropTypes.arrayOf(
    PropTypes.shape({
      questionId: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
      question: PropTypes.string.isRequired,
      choices: PropTypes.arrayOf(PropTypes.string).isRequired,
      correctAnswer: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default IncorrectQuestions;