import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/landingpage';
import Login from './pages/Login';
import Register from './pages/Register';
import Instructor from './pages/Instructor';
import Student from './pages/Student';
import ClassDetails from './pages/instructor/ClassDetails'; // Import ClassDetails

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
          <Route path="/class/:classId" element={<ClassDetails />} /> {/* New route for ClassDetails */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;