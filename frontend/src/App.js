import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import NotePage from "./pages/NotePage";
import CategoryPage from "./pages/CategoryPage";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./routes/ProtectedRoute";
//TODO: import UnauthorizedPage from "./pages/UnauthorizedPage";
//import NotFound from "./pages/NotFound";
import "./styles/App.css";

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="app-container">
          <div className="content-container">
            <NavBar />
            {/* Main content area */}
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<HomePage />} />

              {/* Protected routes */}
              <Route
                path="/notes"
                element={
                  <ProtectedRoute>
                    <NotePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/categories"
                element={
                  <ProtectedRoute>
                    <CategoryPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
