import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import personIcon from '../../media/person-icon.svg';


const ClassDetails = () => {
  const { classId } = useParams();
  const [selectedClass, setSelectedClass] = useState(null);
  const [registeredStudents, setRegisteredStudents] = useState([]); // For selected class students
  const [filteredStudents, setFilteredStudents] = useState([]); // For search results
  const [searchTerm, setSearchTerm] = useState(''); // Store the search input
  const [students, setStudents] = useState([]); // Store selected students
  const [error, setError] = useState('');

  // Fetch class details and students
  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/class/${classId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          setSelectedClass(data.class);
          setRegisteredStudents(data.class.students);
        } else {
          setError(data.error || 'Error fetching class details');
        }
      } catch (err) {
        console.error('Error fetching class details:', err);
        setError('An error occurred while fetching class details.');
      }
    };

    fetchClassDetails();
  }, [classId]);

  // Fetch students to add (search functionality)
  const handleSearch = async (e) => {
    const term = e.target.value; // Get the search term
    setSearchTerm(term); // Update the search term

    if (!term) {
      setFilteredStudents([]); // Clear results if the search term is empty
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/students`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        // Filter students based on the query
        const results = data.students.filter(student =>
          `${student.fname} ${student.lname}`.toLowerCase().includes(term.toLowerCase()) ||
          student.email.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredStudents(results); // Update filtered results
      } else {
        setError(data.error || 'Error fetching student search results');
      }
    } catch (err) {
      console.error('Error searching students:', err);
      setError('An error occurred while searching students.');
    }
  };

  // Select a student to be added to the class
  const handleSelectStudent = (student) => {
    if (!students.some(s => s.email === student.email)) {
      setStudents([...students, student]);
    }
    setFilteredStudents([]); // Clear search results after selection
    setSearchTerm(''); // Clear the search input
  };

  // Remove a student from the selection list
  const handleRemoveStudent = (email) => {
    setStudents(students.filter(student => student.email !== email));
  };

  // Remove a student from the class
  const handleRemoveStudentFromClass = async (studentEmail) => {
    try {
      const response = await fetch(`http://localhost:5000/api/class/${selectedClass._id}/remove-student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ email: studentEmail }),
      });

      const data = await response.json();
      if (data.success) {
        setRegisteredStudents(data.class.students); // Update registered students
      } else {
        setError(data.error || 'Error removing student');
      }
    } catch (err) {
      console.error('Error removing student:', err);
      setError('An error occurred while removing student.');
    }
  };

  // Add selected students to the class
  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (students.length === 0) {
      setError('No students selected.');
      return;
    }

    const emails = students.map(student => student.email);

    try {
      const response = await fetch(`http://localhost:5000/api/class/${selectedClass._id}/add-students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ emails }),
      });

      const data = await response.json();
      if (data.success) {
        setRegisteredStudents(data.class.students); // Update class with new students
        setStudents([]); // Clear selected students
      } else {
        setError(data.error || 'Error adding students');
      }
    } catch (err) {
      console.error('Error adding student:', err);
      setError('An error occurred while adding students.');
    }
  };

  return (
    <div className="container">
      <main className="main-content">
        {error && <p className="error">{error}</p>}
        {selectedClass && (
          <>
            <h2>{selectedClass.name}</h2>
            <p><strong>Description:</strong> {selectedClass.description}</p>
            {selectedClass.type === 'private' ? (
              <p><strong>Class Code:</strong> {selectedClass.code}</p>
            ) : (
              <p><strong>Class Type:</strong> Public</p>
            )}
            <h4>Enrolled Students:</h4>
            <ul>
              {registeredStudents.length > 0 ? (
                registeredStudents.map((student, index) => (
                  <li key={index}>
                    {student.fname} {student.lname} ({student.email})
                    <button type="button" onClick={() => handleRemoveStudentFromClass(student.email)}>
                      Remove
                    </button>
                  </li>
                ))
              ) : (
                <p>No students enrolled.</p>
              )}
            </ul>

            <h4>Add Student:</h4>
            <form onSubmit={handleAddStudent}>
              <div className="form-group">
                <label htmlFor="searchTerm">Search for a student</label>
                <input
                  type="text"
                  id="searchTerm"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Enter name or email"
                  className="form-control"
                />
                {filteredStudents.length > 0 && (
                  <ul className="student-search-results">
                    {filteredStudents.map(student => (
                      <li key={student._id} onClick={() => handleSelectStudent(student)}>
                        {`${student.fname} ${student.lname} (${student.email})`}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="selected-students">
                {students.map(student => (
                  <div key={student.email} className="selected-student">
                    <span>{`${student.fname} ${student.lname}`}</span>
                    <button type="button" onClick={() => handleRemoveStudent(student.email)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button type="submit" className="center-btn">Add Students to Class</button>
            </form>
          </>
        )}
      </main>
    </div>
  );
};

ClassDetails.propTypes = {
  classId: PropTypes.string.isRequired, // Define prop type for classId if needed
};

export default ClassDetails;
