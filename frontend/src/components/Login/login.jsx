import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import logo from "./logo.svg";
import LoginForm from "./LoginForm";

const Login = ({ setUser, user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleGoogleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    setUser(decoded);
    localStorage.setItem("user", JSON.stringify(decoded));
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
          <h1 className="text-3xl font-bold text-[#2E2A47]">Welcome Back!!</h1>
          <p className="text-[#7E8CA0] text-base">
            Log in to access your dashboard.
          </p>
        </div>

        <div className="w-full max-w-sm mt-8">
          <LoginForm setUser={setUser} />

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

          {/* No account? Sign Up option */}
          <p className="text-sm text-center mt-4 text-gray-600">
            No account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-blue-600 hover:underline"
            >
              Sign Up
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
