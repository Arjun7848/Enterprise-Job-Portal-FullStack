import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SeekerDashboard from './pages/SeekerDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import JobListings from './pages/JobListings';
import JobDetails from './pages/JobDetails';
import PostJob from './pages/PostJob';
import AdminDashboard from './pages/AdminDashboard';
import Chat from './pages/Chat';
import Interviews from './pages/Interviews';
import Companies from './pages/Companies';
import CompanyDetails from './pages/CompanyDetails';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<JobListings />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:id" element={<CompanyDetails />} />

          {/* General Private Features */}
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            }
          />

          <Route
            path="/interviews"
            element={
              <PrivateRoute>
                <Interviews />
              </PrivateRoute>
            }
          />

          {/* Seeker */}
          <Route
            path="/seeker/*"
            element={
              <PrivateRoute role="seeker">
                <Routes>
                  <Route path="/" element={<SeekerDashboard />} />
                </Routes>
              </PrivateRoute>
            }
          />

          {/* Recruiter */}
          <Route
            path="/recruiter/*"
            element={
              <PrivateRoute role="recruiter">
                <Routes>
                  <Route path="/" element={<RecruiterDashboard />} />
                  <Route path="/post-job" element={<PostJob />} />
                </Routes>
              </PrivateRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin/*"
            element={
              <PrivateRoute role="admin">
                <Routes>
                  <Route path="/" element={<AdminDashboard />} />
                </Routes>
              </PrivateRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;