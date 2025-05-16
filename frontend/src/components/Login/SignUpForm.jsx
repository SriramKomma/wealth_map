import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SignUpForm = ({ setUser }) => {
  const navigate = useNavigate();
  const [signUpData, setSignUpData] = useState({
    username: "", // change from companyName to username
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = signUpData;

    try {
      const { data } = await axios.post("/register", {
        username,  // sending the username here
        email,
        password,
        confirmPassword,
      });

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Account created successfully");
        setSignUpData({
          username: "",  // reset to empty username
          email: "",
          password: "",
          confirmPassword: "",
        });
        setUser({ email });
        localStorage.setItem("user", JSON.stringify(email));
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <input
        type="text"
        placeholder="Username"  // change label to 'Username'
        value={signUpData.username}  // update value here
        onChange={(e) =>
          setSignUpData({ ...signUpData, username: e.target.value })  // change here
        }
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={signUpData.email}
        onChange={(e) =>
          setSignUpData({ ...signUpData, email: e.target.value })
        }
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={signUpData.password}
        onChange={(e) =>
          setSignUpData({ ...signUpData, password: e.target.value })
        }
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={signUpData.confirmPassword}
        onChange={(e) =>
          setSignUpData({ ...signUpData, confirmPassword: e.target.value })
        }
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
        required
      />
      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        Register
      </button>
    </form>
  );
};

export default SignUpForm;
