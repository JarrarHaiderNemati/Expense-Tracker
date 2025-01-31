import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp({setAuth}) {
  const [useremail, setUseremail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signedup, setSignedup] = useState(false);
  const navigate = useNavigate(); // For redirecting to the login page after signup

  const handleSignUp = async () => {
    // Validate input fields
    if (!useremail || !password || !confirmPassword) {
      alert("Please fill in all the fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const reqs = await fetch("http://localhost:5000/signupForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: useremail,
          pass: password,
        }),
      });

      if (reqs.ok) {
        if(!sessionStorage.getItem('user_email')) {
          sessionStorage.setItem('user_email',useremail);
        }
        setSignedup(true); // Show success message
        setAuth(true);
        setTimeout(() => {
          navigate("/dashboard"); // Redirect after 2 seconds
        }, 2000); // Wait for 2 seconds
        console.log("Signup successful!");
      } else {
        alert("Error signing up!");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign Up
        </h2>
        <div className="mb-4">
          <label
            htmlFor="useremail"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>
          <input
            id="useremail"
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
        <div className="mb-4">
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <button
          onClick={handleSignUp}
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Sign Up
        </button>
        {signedup && (
          <div className="mt-4 p-2 bg-green-400 text-white text-center rounded-md">
            Signup successful! Redirecting...
          </div>
        )}
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Log In
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
