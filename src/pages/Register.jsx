import React, { useEffect, useState } from 'react';
import Header from '../component/header';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Register.css';
import loginImage from '../assets/loginreg.webp';

const Register = () => {
  const [role, setRole] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const roleParam = queryParams.get('role');
    if (roleParam) {
      setRole(roleParam);
    }
  }, []);

  return (
    <div>
      <Header />
      <div id='register' className="container">
        <div className="row">
          <div className="col-12 col-md-6">
            {/* Content for the left container */}
            <img src={loginImage} alt="Register" className="login-image" />   
            <h1 className='left-text'>Your imagination, our platform— class<span>iz.</span> transforms ideas into engaging quizzes!</h1>
          </div>

          <div className="col-12 col-md-6">
            <div className="form-container">
              <h1>class<span>iz.</span></h1>
              <p>Where Every Question Counts.</p>

              <form>
                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <select className="form-control" id="role" name="role" value={role} onChange={(e) => setRole(e.target.value)} required>
                    <option value="" placeholder="Select your role">Select your role</option>
                    <optgroup label="Roles">
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                    </optgroup>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" className="form-control" id="email" name="email" placeholder='' required />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input type="password" className="form-control" id="password" name="password" placeholder='' required />
                </div>
                <div className="form-group">
                  <label htmlFor="confirm-password">Confirm Password</label>
                  <input type="password" className="form-control" id="confirm-password" name="confirm-password" placeholder='' required />
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
                <div className='link-row'>
                    <p>Already have an account?<a href="/login">Login</a></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;