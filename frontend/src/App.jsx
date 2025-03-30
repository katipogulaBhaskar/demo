import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';
import Courses from './components/Courses.jsx';
import Logout from './components/Logout.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx'; // Import the necessary context

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();  // Use the hook to check authentication state
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
    return (
        <AuthProvider>  {/* Wrap your app in AuthProvider */}
            <Router>  {/* ✅ Wrap everything inside BrowserRouter */}
                <Routes>
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/courses"
                        element={
                            <PrivateRoute>
                                <Courses />
                                <Logout />
                            </PrivateRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
