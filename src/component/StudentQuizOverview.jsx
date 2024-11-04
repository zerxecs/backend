    import React, { useState, useEffect, useContext } from 'react';
    import PropTypes from 'prop-types';
    import { FaClock } from 'react-icons/fa';
    import { Modal, Button } from 'react-bootstrap';
    import { useNavigate } from 'react-router-dom';
    import axios from 'axios';
    import { toast, ToastContainer } from 'react-toastify';
    import 'react-toastify/dist/ReactToastify.css';
    import backIcon from '../media/back.svg';
    import { TimerContext } from '../component/TimerContext';
    import StudentQuizResults from '../pages/student/StudentQuizResults';
    
    const StudentQuizOverview = ({ quiz, onBackClick, onQuizSubmit }) => {
        const navigate = useNavigate();
        const quizId = quiz._id;
        const [quizStarted, setQuizStarted] = useState(false);
        const [userName, setUserName] = useState('');
        const [userEmail, setUserEmail] = useState('');
        const [loading, setLoading] = useState(true);
        const [showModal, setShowModal] = useState(false);
        const [answers, setAnswers] = useState({});
        const [score, setScore] = useState(0);
        const [showQuizResults, setShowQuizResults] = useState(false);
        const [submissions, setSubmissions] = useState([]);
        const [data, setData] = useState(null);
        const [selectedQuiz, setSelectedQuiz] = useState(null);
        const [allSubmissions, setAllSubmissions] = useState([]);
        const [selectedQuizData, setSelectedQuizData] = useState(null);
        const [quizResultsData, setQuizResultsData] = useState(null);
        const { timers, startTimer, stopTimer, setTimers } = useContext(TimerContext);
        const [threeMinuteWarningShown, setThreeMinuteWarningShown] = useState(false);
    
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
                    setUserName(data.user.fname);
                    setUserEmail(data.user.email);
                    const uniqueKey = `quizStarted_${data.user.email}_${quizId}`;
                    const uniqueTimeKey = `remainingTime_${data.user.email}_${quizId}`;
                    const storedQuizStarted = JSON.parse(localStorage.getItem(uniqueKey)) || false;
                    const storedRemainingTime = JSON.parse(localStorage.getItem(uniqueTimeKey));
                    setQuizStarted(storedQuizStarted);
                    if (storedQuizStarted) {
                        startTimer(quizId, storedRemainingTime !== null ? storedRemainingTime : quiz.timeLimit.hours * 3600 + quiz.timeLimit.minutes * 60 + quiz.timeLimit.seconds);
                    }
                } catch (error) {
                    console.error('Error fetching the student name:', error);
                } finally {
                    setLoading(false);
                }
            };
    
            fetchUserName();
        }, [quizId, quiz.timeLimit, startTimer]);
    
        useEffect(() => {
            if (userEmail) {
                const uniqueKey = `quizStarted_${userEmail}_${quizId}`;
                localStorage.setItem(uniqueKey, JSON.stringify(quizStarted));
            }
        }, [quizStarted, quizId, userEmail]);
    
        useEffect(() => {
            if (quizStarted && timers[quizId] <= 180 && !threeMinuteWarningShown) {
                toast.warn('You have 3 minutes left to complete the quiz. You will be automatically submitted once the time is up.', {
                    position: 'top-center',
                    autoClose: 5000,
                });
                setThreeMinuteWarningShown(true);
            }
        }, [quizStarted, timers, quizId, threeMinuteWarningShown]);
    
        useEffect(() => {
            if (quizStarted && timers[quizId] === 0) {
                handleSubmit(null, true);
            }
        }, [quizStarted, timers, quizId]);
    
        const handleStartQuiz = () => {
            setShowModal(true);
        };
    
        const handleConfirmStart = () => {
            setQuizStarted(true);
            const initialTime = quiz.timeLimit.hours * 3600 + quiz.timeLimit.minutes * 60 + quiz.timeLimit.seconds;
            startTimer(quizId, initialTime);
            const uniqueTimeKey = `remainingTime_${userEmail}_${quizId}`;
            localStorage.setItem(uniqueTimeKey, JSON.stringify(initialTime));
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
            if (seconds === undefined || isNaN(seconds)) {
                return '0h 0m 0s';
            }
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = seconds % 60;
            return `${h}h ${m}m ${s}s`;
        };
    
        const handleSubmit = async (event, isAutoSubmit = false) => {
            if (event) {
                event.preventDefault();
            }
    
            if (!isAutoSubmit) {
                const unansweredQuestions = quiz.questions.filter((_, index) => !answers.hasOwnProperty(index));
                if (unansweredQuestions.length > 0) {
                    alert('Please answer all questions before submitting.');
                    return;
                }
            }
    
            let calculatedScore = 0;
            quiz.questions.forEach((question, index) => {
                if (answers[index] === question.correct_answer) {
                    calculatedScore += question.points;
                }
            });
            setScore(calculatedScore);
    
            try {
                const response = await axios.post('http://localhost:5000/api/submissions/submit-quiz', {
                    userEmail,
                    quizId,
                    answers,
                    score: calculatedScore,
                });
                setSubmissions(response.data.submissions || []);
    
                if (!userEmail) {
                    alert('User email not found. Please log in again.');
                    return;
                }
    
                const checkSubmissionResponse = await fetch(`http://localhost:5000/api/submissions/quiz/${quiz._id}/check-submission?userEmail=${userEmail}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const checkSubmissionData = await checkSubmissionResponse.json();
                setData(checkSubmissionData);
    
                if (checkSubmissionResponse.ok) {
                    const submissionsResponse = await fetch(`http://localhost:5000/api/submissions/quiz/${quiz._id}/submissions`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                    const submissionsData = await submissionsResponse.json();
                    setAllSubmissions(submissionsData.submissions);
    
                    const quizResponse = await fetch(`http://localhost:5000/api/quizzes/${quiz._id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                    const quizData = await quizResponse.json();
                    setSelectedQuizData(quizData);
    
                    if (checkSubmissionData.hasSubmitted) {
                        setQuizResultsData(quizData);
                        resetQuizState();
                    } else {
                        setSelectedQuiz(quiz);
                    }
    
                    if (onQuizSubmit) {
                        onQuizSubmit();
                    }
    
                    const uniqueTimeKey = `remainingTime_${userEmail}_${quizId}`;
                    localStorage.removeItem(uniqueTimeKey);
                } else {
                    console.error('Error checking submission:', checkSubmissionData.error);
                }
            } catch (error) {
                console.error('Error submitting quiz:', error.response ? error.response.data : error.message);
            }
        };
    
        const resetQuizState = () => {
            setQuizStarted(false);
            setAnswers({});
            setScore(0);
            setSelectedQuiz(null);
            const uniqueKey = `quizStarted_${userEmail}_${quizId}`;
            const uniqueTimeKey = `remainingTime_${userEmail}_${quizId}`;
            localStorage.removeItem(uniqueKey);
            localStorage.removeItem(uniqueTimeKey);
            stopTimer(quizId);
            setShowQuizResults(true);
        };
    
        const handleRetakeQuiz = () => {
            setShowQuizResults(false);
            setSelectedQuiz(selectedQuizData);
            const uniqueTimeKey = `remainingTime_${userEmail}_${quizId}`;
            localStorage.removeItem(uniqueTimeKey);
        };
    
        const handleBackToQuizList = () => {
            setShowQuizResults(false);
            setSelectedQuiz(null);
            onBackClick();
        };
    
        if (showQuizResults && quizResultsData) {
            return (
                <StudentQuizResults
                    quizData={quizResultsData}
                    allSubmissions={allSubmissions}
                    data={data}
                    userEmail={localStorage.getItem('userEmail')}
                    onRetakeQuiz={handleRetakeQuiz}
                    onBack={handleBackToQuizList}
                    onStartQuiz={handleStartQuiz}
                />
            );
        }
    
        return (
            <div id="quiz-overview" className="container">
                <ToastContainer />
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
                                {formatTime(timers[quizId] || 0)}
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
                <Modal show={showModal} onHide={handleCloseModal} className="retake-quiz-modal">
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
            _id: PropTypes.string.isRequired,
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
                    points: PropTypes.number.isRequired,
                })
            ).isRequired,
        }).isRequired,
        onBackClick: PropTypes.func.isRequired,
        onQuizSubmit: PropTypes.func,
    };
    
    export default StudentQuizOverview;