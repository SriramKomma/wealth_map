import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./index.css";

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login:", loginData);
    setUser({ email: loginData.email });
    navigate("/home");
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (signUpData.password !== signUpData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Sign Up:", signUpData);
    setUser({ email: signUpData.email });
    navigate("/home");
  };

  const handleGoogleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    setUser(decoded);
    navigate("/home");
  };

  const handleGoogleError = () => {
    console.error("Google Login Failed");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="bg-red-500 text-white p-4">Test Tailwind</div>{" "}
      {/* Test Tailwind */}
      <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 w-full max-w-[360px] sm:max-w-[400px] transition-all duration-300 animate-popIn">
        <div className="flex justify-center mb-5">
          <h1 className="text-2xl sm:text-2.5xl font-bold text-gray-900 tracking-tight">
            Wealth<span className="text-gold-600">Map</span>
          </h1>
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-center text-gray-900 mb-2">
          {isSignUp ? "Register Your Company" : "Log In"}
        </h2>
        <p className="text-center text-gray-500 text-sm mb-5">
          {isSignUp
            ? "Create an account to access Wealth Map"
            : "Sign in to explore property data"}
        </p>
        {isSignUp ? (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Company Name"
                value={signUpData.companyName}
                onChange={(e) =>
                  setSignUpData({ ...signUpData, companyName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                autoComplete="organization"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                value={signUpData.email}
                onChange={(e) =>
                  setSignUpData({ ...signUpData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={signUpData.password}
                onChange={(e) =>
                  setSignUpData({ ...signUpData, password: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                autoComplete="new-password"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                value={signUpData.confirmPassword}
                onChange={(e) =>
                  setSignUpData({
                    ...signUpData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                autoComplete="new-password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Register
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Log In
            </button>
          </form>
        )}
        <div className="my-5 flex items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-3 text-xs text-gray-400">OR</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="filled_blue"
            size="large"
            text="signin_with"
            className="w-full rounded-md transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          />
        </div>
        <p className="mt-5 text-center text-sm text-gray-600">
          {isSignUp ? "Already have an account?" : "No account?"}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="ml-1 text-blue-600 hover:underline focus:outline-none">
            {isSignUp ? "Log In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
