import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AdminDashboard, TeacherDashboard, StudentDashboard } from './pages/Dashboards';
import Students from './pages/admin/Students';
import Teachers from './pages/admin/Teachers';
import Departments from './pages/admin/Departments';
import Attendance from './pages/admin/Attendance';
import TeacherAttendance from './pages/teacher/Attendance';
import TeacherResults from './pages/teacher/Results';
import TeacherAssignments from './pages/teacher/Assignments';
import TeacherComparison from './pages/teacher/Comparison';
import TeacherLeaves from './pages/teacher/Leaves';
import StudentLeave from './pages/student/Leave';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-[#fffdfa] via-[#fdfbf7] to-[#f4ebe1] text-slate-900">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/students" 
            element={
              <ProtectedRoute role="admin">
                <Students />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/teachers" 
            element={
              <ProtectedRoute role="admin">
                <Teachers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/departments" 
            element={
              <ProtectedRoute role="admin">
                <Departments />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/attendance" 
            element={
              <ProtectedRoute role="admin">
                <Attendance />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/teacher" 
            element={
              <ProtectedRoute role="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/attendance" 
            element={
              <ProtectedRoute role="teacher">
                <TeacherAttendance />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/results" 
            element={
              <ProtectedRoute role="teacher">
                <TeacherResults />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/assignments" 
            element={
              <ProtectedRoute role="teacher">
                <TeacherAssignments />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/compare" 
            element={
              <ProtectedRoute role="teacher">
                <TeacherComparison />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/leaves" 
            element={
              <ProtectedRoute role="teacher">
                <TeacherLeaves />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/student" 
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/leave" 
            element={
              <ProtectedRoute role="student">
                <StudentLeave />
              </ProtectedRoute>
            } 
          />

          <Route path="/" element={
            user ? (
              user.role === 'admin' ? <Navigate to="/admin" /> :
              user.role === 'teacher' ? <Navigate to="/teacher" /> :
              <Navigate to="/student" />
            ) : <Landing />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
