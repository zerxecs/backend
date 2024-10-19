import React, { useState } from "react";
import PropTypes from "prop-types";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Instructor.css'; 
import { Icon } from '@iconify/react';
import homeIcon from '@iconify/icons-heroicons/home-solid';
import classesIcon from '@iconify/icons-icomoon-free/books';
import createClassIcon from '@iconify/icons-ic/baseline-create-new-folder';
import createActivityIcon from '@iconify/icons-mdi/pencil-plus';
import quizzesIcon from '@iconify/icons-material-symbols/library-books';
import examsIcon from '@iconify/icons-healthicons/i-exam-multiple-choice';
import logoutIcon from '@iconify/icons-fluent/person-12-filled';
import helpIcon from '@iconify/icons-fluent/settings-24-filled';
import searchIcon from '@iconify/icons-material-symbols/search';

import Home from './instructor/Home';
import Classes from './instructor/Classes';
import CreateClass from './instructor/CreateClass';
import CreateActivity from './instructor/CreateActivity';
import Quizzes from './instructor/Quizzes';
import Exams from './instructor/Exams';
import Logout from './instructor/Logout';
import HelpSupport from './instructor/HelpSupport';
import HeaderSideBar from '../component/HeaderSideBar';
// Sidebar Component
const Sidebar = ({ setContent, isSidebarVisible }) => {
  const [isLinkedToClass, setIsLinkedToClass] = useState(false);

  return (
    <div id="sidebar" className={`d-flex flex-column flex-shrink-0 p-3 bg-light sidebar ${isSidebarVisible ? 'visible' : 'hidden'}`}>
      <p className="navbar-brand classiz">
        class<span style={{ color: '#BA68C8' }}>iz.</span>
      </p>
      
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item"><h6 className="nav-header">Menu</h6></li>
        <li className="nav-item">
          <a href="#home-instructor" className="nav-link active" onClick={() => setContent("Home")}>
            <Icon icon={homeIcon} /> Home
          </a>
        </li>
        <li className="nav-item">
          <a href="#classes" className="nav-link" onClick={() => setContent("Classes")}>
            <Icon icon={classesIcon} /> Classes
          </a>
        </li>
        <li className="nav-item">
          <a href="#create-class" className="nav-link" onClick={() => setContent("Create Class")}>
            <Icon icon={createClassIcon} /> Create Class
          </a>
        </li>
        {/* <li className="nav-item">
          <a href="#" className="nav-link" onClick={() => setContent("Create Activity")}>
            <Icon icon={createActivityIcon} /> Create Activity
          </a>
        </li> */}
        <li className="nav-item">
          <div className="form-check form-switch">
            <input
              type="checkbox"
              className="form-check-input"
              id="linkToClass"
              checked={isLinkedToClass}
              onChange={() => setIsLinkedToClass(!isLinkedToClass)}
            />
            <label className="form-check-label" htmlFor="linkToClass">
              {isLinkedToClass ? "Linked to a class" : "Not linked to a class"}
            </label>
          </div>
        </li>
        <li className="nav-item"><h6 className="nav-header">Assessment</h6></li>
        <li className="nav-item">
          <a href="#quiz-instructor" className="nav-link" onClick={() => setContent("Quizzes")}>
            <Icon icon={quizzesIcon} /> Quizzes
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link" onClick={() => setContent("Exams")}>
            <Icon icon={examsIcon} /> Exams
          </a>
        </li>
        <li className="nav-item"><h6 className="nav-header">User</h6></li>
        <li className="nav-item">
          <a href="#" className="nav-link" onClick={() => setContent("Logout")}>
            <Icon icon={logoutIcon} /> Logout
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link" onClick={() => setContent("Help & Support")}>
            <Icon icon={helpIcon} /> Help & Support
          </a>
        </li>
      </ul>

      <div className="input-group mb-3">
        <input 
          type="text" 
          placeholder="   Search" 
          className="form-control" 
          onChange={(e) => setContent(`Search Results for "${e.target.value}"`)} 
        />
        <span className="input-group-text">
          <Icon icon={searchIcon} />
        </span>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  setContent: PropTypes.func.isRequired,
  isSidebarVisible: PropTypes.bool.isRequired,
};

const Content = ({ content, classes, addClass, setContent }) => {
  switch(content) {
    case "Home":
      return <Home classes={classes} onCardClick={(classItem) => console.log(classItem)} setContent={setContent} />;
    case "Classes":
      return <Classes classes={classes} />;
    case "Create Class":
      return <CreateClass addClass={addClass} />;
    case "Create Activity":
      return <CreateActivity />;
    case "Quizzes":
      return <Quizzes />;
    case "Exams":
      return <Exams />;
    case "Logout":
      return <Logout />;
    case "Help & Support":
      return <HelpSupport />;
    default:
      return <div>{content}</div>;
  }
};

Content.propTypes = {
  content: PropTypes.string.isRequired,
  classes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      enrollment: PropTypes.number.isRequired,
    })
  ).isRequired,
  addClass: PropTypes.func.isRequired,
  setContent: PropTypes.func.isRequired,  
};

const App = () => {
  const [content, setContent] = useState("Home");
  const [classes, setClasses] = useState([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const addClass = (newClass) => {
    setClasses([...classes, newClass]);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
    document.body.classList.toggle('no-scroll', !isSidebarVisible);
  };

  return (
    <div className="d-flex flex-column" style={{ height: '100vh' }}>
      <HeaderSideBar toggleSidebar={toggleSidebar} />
      <div className="d-flex flex-grow-1">
        <Sidebar setContent={setContent} isSidebarVisible={isSidebarVisible} />
        <div className="main-content flex-grow-1">
          <Content content={content} classes={classes} addClass={addClass} setContent={setContent} />
        </div>
      </div>
    </div>
  );
};

export default App;