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

        {/* Main */}
        <Route path="/home" element={<Home />} />
        <Route path="/jobs" element={<JobFeed />} />
        <Route path="/post-job" element={<JobPostForm />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/applications" element={<MyApplications />} />

        {/* Redirect fallback (optional) */}
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
