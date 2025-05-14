import React, { useState } from "react";
import "./index.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import axios from "axios";
import { Toaster } from "react-hot-toast";

axios.defaults.baseURL = "http://localhost:3001";
axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);

  return (
    <>
    <Toaster position="bottom-right" toastOptions={{duration:2000}}/>
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route
            path="/home"
            element={user ? <Home user={user} /> : <Navigate to="/login" />}
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
    </>
    
  );
}

export default App;
