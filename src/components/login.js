import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Login({ setAuth }) {
  const [useremail, setUseremail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn,setLoggedIn]=useState(false);
  const navigate = useNavigate();

  const handleLogin =async () => {
    const reqs=await fetch('http://localhost:5000/loginForm',{
      method:'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify({
        email:useremail,
        pass:password
      })
    })
    if (reqs.ok) {
      if(!sessionStorage.getItem('user_email')) {
        sessionStorage.setItem('user_email',useremail);
      }
      setAuth(true); // Log in the user
      setLoggedIn(true);
      setTimeout(() => {navigate('/dashboard')}, 2000);
    } else {
      alert("Invalid credentials!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Enter your email"
            autoComplete="off"
            value={useremail}
            onChange={(e) => setUseremail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <button
          onClick={handleLogin}
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Login
        </button>
        {loggedIn&&
            <div className="bg-green-400">Login successful ! </div>          
        }
        <p className="mt-4 text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
