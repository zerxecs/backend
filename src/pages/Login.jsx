import React from 'react';
import Header from '../component/header';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Login.css';
import loginImage from '../assets/loginreg.webp';

const Login = () => {
  return (
    <div>
      <Header />
      <div id='login' className="container">
        <div className="row">
          <div className="col-12 col-md-6">
            {/* Content for the left container */}
            <img src={loginImage} alt="Login" className="login-image" />   
            <h1 className='left-text'>Your imagination, our platform— class<span>iz.</span> transforms ideas into engaging quizzes!</h1>
            
          </div>

          <div className="col-12 col-md-6">
            <div className="form-container">
              <h1>class<span>iz.</span></h1>
              <p>Where Every Question Counts.</p>

              <form>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input type="text" className="form-control" id="username" name="username" required />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input type="password" className="form-control" id="password" name="password"  required />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
                <div className='link-row'>
                    <a href="#" className="forgot-pw">Forgot password?</a>
                    <p>Don’t have an account?<a href="/register">Sign up</a></p>

                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;