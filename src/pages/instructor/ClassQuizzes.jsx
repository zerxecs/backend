import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../css/InstructorQuizzes.css';
import { FaFilter } from 'react-icons/fa'; 
import calendarIcon from '../../media/calendar.svg';
import quizOverviewIcon from '../../media/quiz_overview.svg';
import studentRecordIcon from '../../media/records.svg';
import EditActivity from './EditActivity'; // Import EditActivity component
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ClassQuizzes = ({ selectedClass, onBack, onQuizUpdateSuccess }) => {
    const [quizzes, setQuizzes] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null); // State to manage selected quiz

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

    useEffect(() => {
        fetchQuizzes();
    }, [selectedClass]);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleQuizOverviewClick = (quiz) => {
        setSelectedQuiz(quiz); // Set the selected quiz
    };

    const handleQuizUpdate = (updatedQuiz) => {
        setQuizzes((prevQuizzes) =>
            prevQuizzes.map((quiz) => (quiz._id === updatedQuiz._id ? updatedQuiz : quiz))
        );
        setSelectedQuiz(null); // Close the EditActivity component
        fetchQuizzes(); // Fetch the latest quizzes after an update
        toast.success('Quiz updated successfully!', {
            className: 'custom-toast'
        });
        if (onQuizUpdateSuccess) {
            onQuizUpdateSuccess(updatedQuiz); 
        }
    };

    if (selectedQuiz) {
        return (
            <>
                <EditActivity onBackClick={() => setSelectedQuiz(null)} selectedClass={selectedClass} quiz={selectedQuiz} onQuizUpdate={handleQuizUpdate} />
                <ToastContainer />
            </>
        );
    }

    return (
        <div id='instructor-quiz' >
            <header className="header">
                <button className="button" onClick={onBack}>Back</button>
                <button className="button">Upcoming</button>
                <button className="button">Incomplete</button>
                <button className="button">Completed</button>

                <div className="dropdown">
                    <button className="button dropdown-button" onClick={toggleDropdown}>
                        <FaFilter className="filter-icon" /> 
                         <span className="hide-text">Filter By</span>
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
                                <div className="card-divider" />
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
                            <button className="quiz-section" onClick={() => handleQuizOverviewClick(quiz)}>
                                <div className="quiz-image-holder">
                                    <img src={quizOverviewIcon} alt="Quiz Overview" className="quiz-overview" />
                                </div>
                                <div className="description-holder">
                                     Quiz Overview
                                    <p className="description">Toggle between Preview Mode to view the quiz and Edit Mode to modify questions and settings in the same tab.</p>
                                </div>
                            </button >

                            <button className="quiz-section">
                                <div className="quiz-image-holder">
                                    <img src={studentRecordIcon} alt="Student Record" className="student-record" />
                                </div>
                                <div className="description-holder">
                                    Student Records
                                    <p className="description">Displays overall scores, and performance analytics for the selected quiz.</p>
                                </div>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <ToastContainer />
        </div>
    );
};

ClassQuizzes.propTypes = {
    selectedClass: PropTypes.object.isRequired,
    onBack: PropTypes.func.isRequired,
    onQuizUpdateSuccess: PropTypes.func, // Add new prop type
};

export default ClassQuizzes;