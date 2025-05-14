import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import logo from "./logo.svg";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

const Login = ({ setUser }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    setUser(decoded);
    navigate("/home");
  };

  const handleGoogleError = () => {
    console.error("Google Login Failed");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Section */}
      <div className="flex flex-col justify-center items-center px-4">
        <div className="text-center space-y-4 pt-12">
          <h1 className="text-3xl font-bold text-[#2E2A47]">
            {isSignUp ? "Create Your Account" : "Welcome Back!!"}
          </h1>
          <p className="text-[#7E8CA0] text-base">
            {isSignUp
              ? "Register to start using the dashboard."
              : "Log in or create account to get back to your dashboard!"}
          </p>
        </div>

        <div className="w-full max-w-sm mt-8">
          {isSignUp ? (
            <SignUpForm setUser={setUser} />
          ) : (
            <LoginForm setUser={setUser} />
          )}

          <div className="my-4 flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-3 text-xs text-gray-400">OR</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_white"
              size="large"
              text="signin_with"
            />
          </div>

          <p className="text-sm text-center mt-4 text-gray-600">
            {isSignUp ? "Already have an account?" : "No account?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 hover:underline"
            >
              {isSignUp ? "Log In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-black">
        <img src={logo} alt="logo" className="invert w-24 h-24" />
        <h1 className="text-white mt-2 text-xl font-semibold">Wealth Map</h1>
      </div>
    </div>
  );
};

export default Login;
