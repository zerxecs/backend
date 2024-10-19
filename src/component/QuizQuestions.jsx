import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/questions_style.css';
import addIcon from './../media/add.svg';

const QuizQuestions = () => {
    const [quiz, setQuiz] = useState({
        quiz_title: '',
        quiz_desc: '',
        quiz_instructions: '',
        questions: [
            {
                question: '',
                choices: ['', '', '', ''],
                correct_answer: '',
                points: ''
            }
        ]
    });

    const navigate = useNavigate();

    const handleChange = (e, index, choiceIndex) => {
        const { name, value } = e.target;
        if (name.startsWith('choice')) {
            const updatedQuestions = [...quiz.questions];
            updatedQuestions[index].choices[choiceIndex] = value;
            setQuiz({ ...quiz, questions: updatedQuestions });
        } else {
            const updatedQuestions = [...quiz.questions];
            updatedQuestions[index][name] = value;
            setQuiz({ ...quiz, questions: updatedQuestions });
        }
    };

    const handleQuizChange = (e) => {
        const { name, value } = e.target;
        setQuiz({ ...quiz, [name]: value });
    };

    const addQuestion = () => {
        setQuiz({
            ...quiz,
            questions: [
                ...quiz.questions,
                { question: '', choices: ['', '', '', ''], correct_answer: '', points: '' }
            ]
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/api/quizzes', quiz)
            .then(response => {
                console.log(response.data);
                navigate('/quizzes');
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };

    return (
        <form onSubmit={handleSubmit} id="quiz-form">

            <div className="questions-card">
                <label htmlFor="quiz-title">Provide the quiz title</label>
                <input type="text" id="quiz-title" name="quiz_title" className="input" placeholder="Quiz Title" value={quiz.quiz_title} onChange={handleQuizChange} />

                <label htmlFor="quiz-desc">Enter a short description for the quiz</label>
                <textarea id="quiz-desc" name="quiz_desc" className="textarea" placeholder="Quiz Description" value={quiz.quiz_desc} onChange={handleQuizChange}></textarea>

                <label htmlFor="quiz-instructions">Include any instructions or guidelines for the students</label>
                <textarea id="quiz-instructions" name="quiz_instructions" className="textarea" placeholder="Quiz Instructions" value={quiz.quiz_instructions} onChange={handleQuizChange}></textarea>
            </div>

            {quiz.questions.map((q, index) => (
                <div className="cardQuestions" key={index}>
                    <div className="question-set">
                        <label htmlFor={`question-${index}`}>Provide the question</label>
                        <input type="text" id={`question-${index}`} name="question" className="input" placeholder="Question" value={q.question} onChange={(e) => handleChange(e, index)} />

                        <label htmlFor={`choices-${index}`}>List of the choices</label>
                        <div id={`choices-${index}`} className="choices">
                            {q.choices.map((choice, choiceIndex) => (
                                <div className="option-wrapper" key={choiceIndex}>
                                    <input type="text" name={`choice${choiceIndex + 1}`} className="input option" placeholder={`Option ${choiceIndex + 1}`} value={choice} onChange={(e) => handleChange(e, index, choiceIndex)} />
                                </div>
                            ))}
                        </div>

                        <label htmlFor={`correct-answer-${index}`} className="correct-answer-label">Correct Answer:</label>
                        <textarea id={`correct-answer-${index}`} name="correct_answer" className="textarea" placeholder="Enter correct answer" value={q.correct_answer} onChange={(e) => handleChange(e, index)}></textarea>

                        <label htmlFor={`points-${index}`} className="points-label">Points:</label>
                        <input type="number" id={`points-${index}`} name="points" className="input" placeholder="Enter points" value={q.points} onChange={(e) => handleChange(e, index)} />
                    </div>
                </div>
            ))}

            <button type="button" className="btn-add" onClick={addQuestion}>
                <img src={addIcon} alt="Add Icon" />
            </button>       
            <button type="submit" className="btn-create">Create</button>
        </form>
    );
};

export default QuizQuestions;