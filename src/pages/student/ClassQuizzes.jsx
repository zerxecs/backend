import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import '../../css/InstructorQuizzes.css';
import calendarIcon from '../../media/calendar.svg';
import quizOverviewIcon from '../../media/quiz_overview.svg';
import studentRecordIcon from '../../media/records.svg';
import PerformanceAnalysis from './PerformanceAnalysis'; // Import PerformanceAnalysis component
import SubmitQuiz from './SubmitQuiz'; // Import SubmitQuiz component

const ClassQuizzes = ({ selectedClass, onBack }) => {
    const [quizzes, setQuizzes] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null); // State to manage selected quiz
    const [showPerformance, setShowPerformance] = useState(false); // State to manage performance view

    useEffect(() => {
        // Fetch quizzes for the selected class
        const fetchQuizzes = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/quizzes?class_id=${selectedClass._id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setQuizzes(data);
                } else {
                    console.error('Error fetching quizzes:', data.error);
                }
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            }
        };

        fetchQuizzes();
    }, [selectedClass]);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleQuizClick = (quiz) => {
        setSelectedQuiz(quiz); // Set the selected quiz
    };

    const handlePerformanceClick = (quiz) => {
        setSelectedQuiz(quiz);
        setShowPerformance(true);
    };

    if (selectedQuiz && showPerformance) {
        return <PerformanceAnalysis quizId={selectedQuiz._id} />;
    }

    if (selectedQuiz) {
        return <SubmitQuiz quiz={selectedQuiz} />;
    }

    return (
        <div id='student-quiz' className="container">
            <header className="header">
                <button className="button" onClick={onBack}>Back</button>
                <button className="button">Upcoming</button>
                <button className="button">Incomplete</button>
                <button className="button">Completed</button>

                <div className="dropdown">
                    <button className="button dropdown-button" onClick={toggleDropdown}>
                        <FaFilter className="filter-icon" />Filter By
                    </button>
                    {dropdownVisible && (
                        <div className="dropdown-menu">
                            <button className="dropdown-item">Public</button>
                            <button className="dropdown-item">Private</button>
                        </div>
                    )}
                </div>
            </header>

            <hr className="divider" />

            <div className="quiz-list">
                {quizzes.map((quiz, index) => (
                    <div className="quiz-card" key={index}>
                        <div className="quiz-wrapper">
                            <div className="details-wrapper">
                                <h2 className="quiz-title">{quiz.quiz_title}</h2>
                                <hr />
                                {quiz.deadline && (
                                    <div className="date-wrapper">
                                        <img src={calendarIcon} alt="Calendar Icon" className="image icon" />
                                        <p className="due-date">
                                            Due Date: {new Date(`${quiz.deadline.date}T${quiz.deadline.time}`).toLocaleString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: 'numeric',
                                                minute: 'numeric',
                                                hour12: true
                                            })}
                                        </p>
                                    </div>
                                )}
                                <p className="course-code">Description: {selectedClass.description}</p>
                            </div>
                        </div>

                        <div className="quiz-details">
                            <button className="quiz-section" onClick={() => handleQuizClick(quiz)}>
                                <div className="quiz-image-holder">
                                    <img src={quizOverviewIcon} alt="Quiz Overview" className="quiz-overview" />
                                </div>
                                <div className="description-holder">
                                     Take Quiz
                                    <p className="description">Start answering the quiz.</p>
                                </div>
                            </button >

                            <button className="quiz-section" onClick={() => handlePerformanceClick(quiz)}>
                                <div className="quiz-image-holder">
                                    <img src={studentRecordIcon} alt="Performance Overview" className="student-record" />
                                </div>
                                <div className="description-holder">
                                    Performance Overview
                                    <p className="description">View your performance and analytics for the selected quiz.</p>
                                </div>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

ClassQuizzes.propTypes = {
    selectedClass: PropTypes.object.isRequired,
    onBack: PropTypes.func.isRequired,
};

export default ClassQuizzes;