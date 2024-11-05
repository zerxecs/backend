import React from 'react';
import PropTypes from 'prop-types';
import '../css/incorrect_questions.css';

const IncorrectQuestions = ({ incorrectQuestions }) => {
  const headingText = incorrectQuestions.length > 1 
    ? `Top ${Math.min(3, incorrectQuestions.length)} Questions Where Most Students Got It Wrong`
    : 'Question Where Most Students Got It Wrong';

  return (
    <div className="incorrect-questions">
      <h2>{headingText}</h2>
      <table>
        <thead>
          <tr>
            <th>Question</th>
            <th>Choices</th>
            <th>Correct Answer</th>
            <th>Total Incorrect Responses by Students</th>
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