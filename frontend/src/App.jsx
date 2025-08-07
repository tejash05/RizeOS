import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JobPostForm from "./pages/JobPostForm";
import Home from "./pages/Home";
import JobFeed from "./pages/JobFeed";
import EditProfile from "./pages/EditProfile";
import PaymentsPage from "./pages/PaymentsPage";
import MyApplications from "./pages/MyApplications";
import PrivateRoute from "./utils/PrivateRoute";

function AppWrapper() {
  const location = useLocation();
  const hideNavbarRoutes = ["/", "/login", "/register"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Main Routes */}
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/jobs" element={<PrivateRoute><JobFeed /></PrivateRoute>} />
        <Route path="/post-job" element={<PrivateRoute><JobPostForm /></PrivateRoute>} />
        <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
        <Route path="/payments" element={<PrivateRoute><PaymentsPage /></PrivateRoute>} />
        <Route path="/applications" element={<PrivateRoute><MyApplications /></PrivateRoute>} />

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
