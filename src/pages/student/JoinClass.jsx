import React, { useState, useEffect } from "react";
import '../../css/Classes.css';

const JoinClass = () => {
    const [registeredClasses, setRegisteredClasses] = useState([]); // Registered private classes
    const [error, setError] = useState('');
    const [classCode, setClassCode] = useState(''); // State for class code input
    const [classes, setClasses] = useState([]); // All classes

    // Fetch all classes
    const fetchClasses = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/public-classes', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const data = await response.json();
            if (data.success) {
                setClasses(data.classes);
            } else {
                setError(data.error || 'Error fetching classes');
            }

            // Fetch registered classes
            const registeredResponse = await fetch('http://localhost:5000/api/registered-classes', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const registeredData = await registeredResponse.json();
            if (registeredData.success) {
                setRegisteredClasses(registeredData.classes);
            } else {
                setError(registeredData.error || 'Error fetching registered classes');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('An error occurred while fetching classes.');
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const handleRegisterClass = async () => {
        if (!classCode) {
            setError('Please enter a class code.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/register-private-class', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ classCode }),
            });

            const data = await response.json();
            if (data.success) {
                // Check if the class is already registered
                const isAlreadyRegistered = registeredClasses.some(
                    (registeredClass) => registeredClass.id === data.class.id
                );

                if (!isAlreadyRegistered) {
                    setRegisteredClasses((prev) => [...prev, data.class]); // Add the newly registered class
                }

                setClassCode(''); // Clear the input field
                setError(''); // Clear any previous errors
                fetchClasses(); // Refresh the list of classes
            } else {
                setError(data.error || 'Error registering for the class');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('An error occurred while registering for the class.');
        }
    };

    return (
        <div id="classes" className="main-content">
            <div className="join-class">
                <h2 className="colored regtext">Enter Class Code to Register for Private Class</h2>
                <div className="input-group">
                    <input
                        type="text"
                        value={classCode}
                        onChange={(e) => setClassCode(e.target.value)}
                        placeholder="Enter class code"
                    />
                    <button onClick={handleRegisterClass}>Register</button>
                </div>
            </div>
        </div>
    );
};

export default JoinClass;