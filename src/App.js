import { useState } from "react";
import "./App.css";
import Dashboard from "./components/dashboard";
import Login from "./components/login";
import Signup from "./components/signup";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

function App() {
  const [isAuth, setAuth] = useState(false); // Manages login state

  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route path="/signup" element={<Signup setAuth={setAuth}/>} />

        {/* Dashboard (Protected) */}
        <Route
          path="/dashboard"
          element={
            isAuth ? (
              <Dashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Default Route (Redirect unknown routes to login) */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
