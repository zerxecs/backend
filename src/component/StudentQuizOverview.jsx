    import React, { useState, useEffect } from 'react';
    import PropTypes from 'prop-types';
    import { FaClock } from 'react-icons/fa';
    import { Modal, Button } from 'react-bootstrap';
    import { useNavigate } from 'react-router-dom';
    import axios from 'axios';
    import backIcon from '../media/back.svg'; // Import the backIcon image
    
    const StudentQuizOverview = ({ quiz, onBackClick }) => {
        const navigate = useNavigate();
        const quizId = quiz._id; // Use _id instead of id
        const [quizStarted, setQuizStarted] = useState(false);
        const [userName, setUserName] = useState('');
        const [userId, setUserId] = useState('');
        const [loading, setLoading] = useState(true);
        const [showModal, setShowModal] = useState(false);
        const [remainingTime, setRemainingTime] = useState(0);
        const [answers, setAnswers] = useState({});
        const [score, setScore] = useState(0);
    
        useEffect(() => {
            const fetchUserName = async () => {
                try {
                    const response = await fetch('http://localhost:5000/api/user', {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    console.log('Fetched User Data:', data); // Log the fetched user data
                    setUserName(data.user.fname);
                    setUserId(data.user._id); // Ensure the correct field is used
                    const uniqueKey = `quizStarted_${data.user._id}_${quizId}`;
                    const uniqueTimeKey = `remainingTime_${data.user._id}_${quizId}`;
                    const storedQuizStarted = JSON.parse(localStorage.getItem(uniqueKey)) || false;
                    const storedRemainingTime = JSON.parse(localStorage.getItem(uniqueTimeKey));
                    setQuizStarted(storedQuizStarted);
                    setRemainingTime(
                        storedRemainingTime !== null
                            ? storedRemainingTime
                            : quiz.timeLimit.hours * 3600 + quiz.timeLimit.minutes * 60 + quiz.timeLimit.seconds
                    );
                } catch (error) {
                    console.error('Error fetching the student name:', error);
                } finally {
                    setLoading(false);
                }
            };
    
            fetchUserName();
        }, [quizId, quiz.timeLimit]);
    
        useEffect(() => {
            let timer;
            if (quizStarted && remainingTime > 0) {
                timer = setInterval(() => {
                    setRemainingTime((prevTime) => {
                        const newTime = prevTime - 1;
                        const uniqueTimeKey = `remainingTime_${userId}_${quizId}`;
                        localStorage.setItem(uniqueTimeKey, JSON.stringify(newTime));
                        return newTime;
                    });
                }, 1000);
            }
            return () => clearInterval(timer);
        }, [quizStarted, remainingTime, quizId, userId]);
    
        useEffect(() => {
            if (userId) {
                const uniqueKey = `quizStarted_${userId}_${quizId}`;
                localStorage.setItem(uniqueKey, JSON.stringify(quizStarted));
            }
        }, [quizStarted, quizId, userId]);
    
        const handleStartQuiz = () => {
            setShowModal(true);
        };
    
        const handleConfirmStart = () => {
            setQuizStarted(true);
            setRemainingTime(quiz.timeLimit.hours * 3600 + quiz.timeLimit.minutes * 60 + quiz.timeLimit.seconds);
            const uniqueTimeKey = `remainingTime_${userId}_${quizId}`;
            localStorage.setItem(uniqueTimeKey, JSON.stringify(remainingTime));
            setShowModal(false);
        };
    
        const handleCloseModal = () => {
            setShowModal(false);
        };
    
        const handleChange = (questionIndex, choice) => {
            setAnswers({
                ...answers,
                [questionIndex]: choice,
            });
        };
    
        const handleBack = () => {
            onBackClick();
        };
    
        const formatTime = (seconds) => {
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = seconds % 60;
            return `${h}h ${m}m ${s}s`;
        };
    
        const handleSubmit = async (event) => {
            event.preventDefault();
    
            // Validate responses
            const unansweredQuestions = quiz.questions.filter((_, index) => !answers.hasOwnProperty(index));
            if (unansweredQuestions.length > 0) {
                alert('Please answer all questions before submitting.');
                return;
            }
    
            // Calculate score
            let calculatedScore = 0;
            quiz.questions.forEach((question, index) => {
                if (answers[index] === question.correct_answer) {
                    calculatedScore += question.points; // Use points for each correct answer
                }
            });
            setScore(calculatedScore);
    
            // Log the userId to ensure it is set correctly
            console.log('Submitting quiz with userId:', userId);
    
            // Store or submit responses
            try {
                const response = await axios.post('http://localhost:5000/api/submit-quiz', {
                    userId,
                    quizId,
                    answers,
                    score: calculatedScore,
                });
                console.log('Quiz submitted successfully:', response.data);
            } catch (error) {
                console.error('Error submitting quiz:', error.response ? error.response.data : error.message);
            }
        };
    
        return (
            <div id="quiz-overview" className="container">
                {!quizStarted ? (
                    <div className="start-section">
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <>
                                <button onClick={handleBack} className="back-btn">
                                    <img src={backIcon} alt="Back" />
                                </button>
                                <div className="title-container">
                                    <div className="quiz-title-container">
                                        <h2 className="quiz-title">{quiz.quiz_title}</h2>
                                    </div>
                                </div>
                                <div className="content-container">
                                    <p className="time-limit">
                                        <FaClock />
                                        {`${quiz.timeLimit.hours}h ${quiz.timeLimit.minutes}m ${quiz.timeLimit.seconds}s`}
                                    </p>
                                    <p className="greeting">Hi {userName}, welcome to the quiz!</p>
                                    <p className="reminder">
                                        Reminder: This is a timed quiz. Once you start, you cannot pause the
                                        timer. Your answers will be automatically submitted when the time is
                                        up, so please make sure to submit your answers on time.
                                    </p>
                                    <button onClick={handleStartQuiz} className="start-btn">
                                        Start Quiz
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <>
                        <button onClick={handleBack} className="back-btn">
                            <img src={backIcon} alt="Back" />
                        </button>
                        <div className="quiz-section">
                            <h2>{quiz.quiz_title}</h2>
                            <p className="time-remaining">
                                <FaClock style={{ marginRight: '5px' }} />
                                {formatTime(remainingTime)}
                            </p>
                            <hr />
                            <h3>{quiz.quiz_desc}</h3>
                            <p>{quiz.quiz_instructions}</p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            {quiz.questions.map((question, index) => (
                                <div key={index} className="question-card">
                                    <h3>{question.question}</h3>
                                    <div className="options">
                                        {question.choices.map((choice, choiceIndex) => (
                                            <label key={choiceIndex} className="radio-label">
                                                <input
                                                    type="radio"
                                                    name={`question${index}`}
                                                    value={choice}
                                                    onChange={() => handleChange(index, choice)}
                                                />
                                                <span>{choice}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <button type="submit" className="submit-btn">
                                Submit
                            </button>
                        </form>
                    </>
                )}
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Start Quiz</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to start the quiz? Once started, the timer cannot be paused.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleConfirmStart}>
                            Start Quiz
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    };
    
    StudentQuizOverview.propTypes = {
        quiz: PropTypes.shape({
            _id: PropTypes.string.isRequired, // Use _id instead of id
            quiz_title: PropTypes.string.isRequired,
            quiz_desc: PropTypes.string.isRequired,
            quiz_instructions: PropTypes.string.isRequired,
            timeLimit: PropTypes.shape({
                hours: PropTypes.number,
                minutes: PropTypes.number,
                seconds: PropTypes.number,
            }).isRequired,
            questions: PropTypes.arrayOf(
                PropTypes.shape({
                    _id: PropTypes.string.isRequired,
                    question: PropTypes.string.isRequired,
                    choices: PropTypes.arrayOf(PropTypes.string).isRequired,
                    correct_answer: PropTypes.string.isRequired,
                    points: PropTypes.number.isRequired, // Add points field
                })
            ).isRequired,
        }).isRequired,
        onBackClick: PropTypes.func.isRequired,
    };
    
    export default StudentQuizOverview;