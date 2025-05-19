import React, { useState,useEffect } from "react";
import "./index.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login/login";
import SignUp from "./components/Login/SignUp";
import Home from "./components/Home";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import {UserContextProvider} from "./context/userContext";
import ProtectedRoute from "./components/Login/ProtectedRoute";
import Profile from "./components/PopupPanel/Profile";

axios.defaults.baseURL = "http://localhost:3001";
axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.email) {
          setUser(parsedUser);
        }
      } catch (err) {
        console.error("Invalid user in localStorage:", err);
        localStorage.removeItem("user"); // clean up bad data
      }
    }
    setLoading(false);
  }, []);
  if (loading) return <div className="text-center mt-10">Loading...</div>; // or a spinner


  return (
    <UserContextProvider>
    <Toaster position="bottom-right" toastOptions={{duration:2000}}/>
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login user={user} setUser={setUser} />} />
          <Route path="/signup" element={<SignUp user={user} setUser={setUser}/>} />
          <Route
            path="/home"
            element={
              <ProtectedRoute user={user}>
                <Home user={user} setUser={setUser} />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/profile/:id" element={<Profile />} />
        </Routes>
      </div>
    </Router>
    </UserContextProvider>

  );
}

export default App;
