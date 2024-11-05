import React from 'react';
import '../../css/performance_overview.css';
import calendarIcon from '../../media/calendar.svg';
import performanceIcon from '../../media/performance.svg';
import PropTypes from 'prop-types';
import QuizScoresBarGraph from '../../component/QuizScoresBarGraph';
import IncorrectQuestions from '../../component/IncorrectQuestions';
import '@fortawesome/fontawesome-free/css/all.min.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const QuizResults = ({ quiz, submissions, className, totalAssignedStudents, registeredStudents, onBack, backIcon }) => {
  const turnedInCount = new Set(submissions.map(submission => submission.userEmail)).size;

  console.log('Submissions:', submissions); // Add this line to debug
  console.log('Quiz Questions:', quiz.questions); // Add this line to debug

  // Calculate incorrect questions
  const incorrectQuestionsMap = {};
  submissions.forEach(submission => {
    if (submission.answers && typeof submission.answers === 'object') {
      Object.entries(submission.answers).forEach(([questionIndex, selectedAnswer]) => {
        const question = quiz.questions[questionIndex];
        console.log('Answer:', { questionIndex, selectedAnswer }); // Add this line to debug
        console.log('Question:', question); // Add this line to debug
        if (question && question.correct_answer !== selectedAnswer) {
          if (!incorrectQuestionsMap[question._id]) {
            incorrectQuestionsMap[question._id] = {
              questionId: question._id,
              question: question.question,
              choices: question.choices,
              correctAnswer: question.correct_answer,
              count: 0
            };
          }
          incorrectQuestionsMap[question._id].count += 1;
        }
      });
    }
  });

  const incorrectQuestions = Object.values(incorrectQuestionsMap).sort((a, b) => b.count - a.count).slice(0, 3);

  const exportPDF = () => {
    const doc = new jsPDF();
    const headerColor = [60, 42, 93];
    const barColor = [126, 87, 194];
    const highlightColor = [218, 136, 249];
  
    let currentY = 10;

    const quizDetails = [
      ['Class', className],
      ['Quiz Title', quiz.quiz_title],
      ['Due Date', new Date(`${quiz.deadline.date}T${quiz.deadline.time}`).toLocaleString('en-US', {
          month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
      })],
      ['Description', quiz.quiz_desc]
    ];
  
    doc.autoTable({
        head: [['Field', 'Details']],
        body: quizDetails,
        startY: currentY,
        theme: 'grid',
        headStyles: { fillColor: headerColor },
        columnStyles: { 0: { cellWidth: 40 }, 1: { cellWidth: 'auto' } }
    });
    currentY = doc.lastAutoTable.finalY + 10;

    const submissionSummary = [
      ['Assigned', `${totalAssignedStudents} students`],
      ['Turned-in', `${turnedInCount} ${turnedInCount === 1 ? 'student' : 'students'}`],
      ['Missed', `${totalAssignedStudents - turnedInCount} ${totalAssignedStudents - turnedInCount === 1 ? 'student' : 'students'}`]
    ];
  
    doc.autoTable({
        head: [['Submission Status', 'Count']],
        body: submissionSummary,
        startY: currentY,
        theme: 'grid',
        headStyles: { fillColor: headerColor },
        columnStyles: { 0: { cellWidth: 40 }, 1: { cellWidth: 'auto' } }
    });
    currentY = doc.lastAutoTable.finalY + 10;

    const studentResults = submissions.map((submission) => {
      const student = registeredStudents.find(student => student.email === submission.userEmail);
      return {
        name: student ? `${student.fname} ${student.lname}` : submission.userEmail,
        score: submission.score
      };
    });
  
    const graphStartX = 10;
    const graphStartY = currentY + 30;
    const barWidth = 15;
    const maxBarHeight = 60;
    const maxScore = Math.max(...studentResults.map(result => result.score)) || 100;
  
    let highestScoreIndex = -1;

    studentResults.forEach((result, index) => {
      const barHeight = (result.score / maxScore) * maxBarHeight;
      const barX = graphStartX + index * (barWidth + 10);
      const barY = graphStartY + (maxBarHeight - barHeight);

      doc.setFillColor(...barColor);
      doc.rect(barX, barY, barWidth, barHeight, 'F');

      doc.setTextColor(...highlightColor);
      doc.setFontSize(10);
      doc.text(`${result.score}`, barX + barWidth / 2, barY - 3, { align: 'center' });
      doc.text(result.name, barX + barWidth / 2, graphStartY + maxBarHeight + 5, { align: 'center', angle: 90 });

      if (result.score === maxScore) {
          highestScoreIndex = index;
      }
    });

    if (highestScoreIndex !== -1) {
      const highestScoreBarX = graphStartX + highestScoreIndex * (barWidth + 10);
      const highestScoreBarY = graphStartY + (maxBarHeight - (maxScore / maxScore) * maxBarHeight);
      doc.setTextColor(255, 0, 0);
      doc.setFontSize(12);
      doc.text(`Highest: ${maxScore}`, highestScoreBarX + barWidth / 2, highestScoreBarY - 10, { align: 'center', baseline: 'bottom' });
    }
  
    currentY = graphStartY + maxBarHeight + 20;

    const submissionCounts = {};

    const tableData = submissions.map((submission) => {
      const student = registeredStudents.find(student => student.email === submission.userEmail);
      const submissionTime = new Date(submission.submittedAt).toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });

      // Increment the attempt count for the student
      submissionCounts[submission.userEmail] = (submissionCounts[submission.userEmail] || 0) + 1;
  
      return [
        submissionCounts[submission.userEmail],
        student ? `${student.fname} ${student.lname}` : submission.userEmail,
        submissionTime,
        submission.score
      ];
    });
  
    doc.autoTable({
      head: [['Attempt', 'Student Name', 'Submission Time', 'Score']],
      body: tableData,
      startY: currentY,
      theme: 'grid',
      headStyles: { fillColor: headerColor }
    });
    currentY = doc.lastAutoTable.finalY + 20;

    const performanceOverviewData = incorrectQuestions.map((question, index) => [
      index + 1,
      question.question,
      question.count
    ]);
  
    doc.autoTable({
      head: [['#', 'Question', 'Incorrect Count']],
      body: performanceOverviewData,
      startY: currentY,
      theme: 'grid',
      headStyles: { fillColor: headerColor }
    });
  
    doc.save('quiz_results.pdf');
  };


  // Create a map to count the number of submissions per student
  const submissionCounts = {};

  return (
    <>
    <header className="header-back">
    <button className="back-btn" onClick={onBack}>
      <img src={backIcon} alt="Back Icon" />
    </button>
  </header>

    <div id='instructor-performance-ov' className="perfomance-container">
      <div className="quiz-wrapper">
        <div className="details-wrapper">
          <h1 className="quiz-title">{className}</h1>
          <h2 className="quiz-title">{quiz.quiz_title}</h2>
          <hr />
          <div className="date-wrapper">
            <img src={calendarIcon} alt="Calendar Icon" className="image icon" />
            <p className="due-date">Due Date: {new Date(`${quiz.deadline.date}T${quiz.deadline.time}`).toLocaleString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            })}</p>
          </div>
          <p className="course-code">Description: {quiz.quiz_desc}</p>
        </div>
      </div>

      <div className="student-list">
      <h2><i className="fas fa-chart-bar"></i> Quiz Results</h2>
         <div className="quiz-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Attempt</th>
                  <th>Student Name</th>
                  <th>Submission Time</th> 
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission, index) => {
                  const student = registeredStudents.find(student => student.email === submission.userEmail);
                  const submissionTime = new Date(submission.submittedAt).toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                  });

                  // Increment the attempt count for the student
                  if (!submissionCounts[submission.userEmail]) {
                    submissionCounts[submission.userEmail] = 1;
                  } else {
                    submissionCounts[submission.userEmail]++;
                  }

                  return (
                    <tr key={index}>
                      <td>{submissionCounts[submission.userEmail]}</td>
                      <td>{student ? `${student.fname} ${student.lname}` : submission.userEmail}</td>
                      <td>{submissionTime}</td>
                      <td>{submission.score}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
         </div>
      </div>

      <div className="performance-overview">
        <div className="image-wrapper">
          <img src={performanceIcon} alt="Performance Overview" className="performance-icon" />
          <h2>Performance Overview</h2>
        </div>
        <QuizScoresBarGraph submissions={submissions} registeredStudents={registeredStudents} />
        <IncorrectQuestions incorrectQuestions={incorrectQuestions} />
      </div>

      <div className="student-summary">
        <p><span className="bold">Assigned: </span> {totalAssignedStudents} students</p>
        <p><span className="bold">Turned-in: </span> {turnedInCount} {turnedInCount === 1 ? 'student' : 'students'}</p>
        <p><span className="bold">Missed: </span> {totalAssignedStudents - turnedInCount} {totalAssignedStudents - turnedInCount === 1 ? 'student' : 'students'}</p>
      </div>

      <div className="export-buttons">
          <button className="export-pdf" onClick={exportPDF}>
            <i className="fas fa-download"></i> Download PDF
          </button>
        </div>
    </div>
    </>

  );
};

QuizResults.propTypes = {
  quiz: PropTypes.object.isRequired,
  submissions: PropTypes.array.isRequired,
  className: PropTypes.string.isRequired,
  totalAssignedStudents: PropTypes.number.isRequired,
  registeredStudents: PropTypes.array.isRequired,
  onBack: PropTypes.func.isRequired,
  backIcon: PropTypes.string.isRequired,
};

export default QuizResults;