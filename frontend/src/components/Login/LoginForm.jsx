import axios from "axios";
import React, { useState  } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";


const LoginForm = ({ setUser }) => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const handleLogin = async(e) => {
    e.preventDefault();
    const { email, password } = loginData;
    try{
      const {data}  =  await axios.post("/login",{
        email,
        password
      });
      if(data.error){
        toast.error(data.error);
      }
      else{
        console.log("Login:", loginData);
        setUser({ email: loginData.email });
        localStorage.setItem("user", JSON.stringify({ email: loginData.email }));
        navigate("/home");
      }
    }
    catch(error){
      return toast.error("Login failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={loginData.email}
        onChange={(e) =>
          setLoginData({ ...loginData, email: e.target.value })
        }
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={loginData.password}
        onChange={(e) =>
          setLoginData({ ...loginData, password: e.target.value })
        }
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
        required
      />
      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        Log In
      </button>
    </form>
  );
};

export default LoginForm;
