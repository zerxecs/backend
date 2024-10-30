import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Instructor from './pages/Instructor';
import LandingPage from './pages/landingpage';
import Login from './pages/Login';
import Register from './pages/Register';
import Student from './pages/student';
<<<<<<< HEAD
=======
import 'bootstrap/dist/css/bootstrap.min.css';
>>>>>>> 7a62157df6d2bcfa97fd5da1cb6b8e1bf5f5c370

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/instructor" element={<Instructor />} /> 
          <Route path="/student" element={<Student />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;