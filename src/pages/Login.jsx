import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    accountType: "jobSeeker", // Default account type is JobSeeker
  });

  // Check if the user is already logged in and redirect accordingly
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const accountType = localStorage.getItem("accountType");
      if (accountType === "employer") {
        navigate("/employer/dashboard"); // Redirect to employer dashboard
      } else {
        navigate("/jobseeker/dashboard"); // Redirect to jobseeker dashboard
      }
    }
  }, [navigate]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle account type change
  const handleAccountTypeChange = (e) => {
    setFormData({ ...formData, accountType: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Determine the API endpoint based on account type
    const endpoint =
      formData.accountType === "employer"
        ? "https://jop-portal-backend-seven.vercel.app/api/employer/login"
        : "https://jop-portal-backend-seven.vercel.app/api/jobseeker/login";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await res.json();
      console.log(data);
      toast.success("Login successful! Redirecting...");

      // Store user info in localStorage
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userName", data.user.fullName);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("accountType", formData.accountType);

      // Force full page reload and redirect based on account type
      setTimeout(() => {
        if (formData.accountType === "employer") {
          window.location.href = "/employer/dashboard";
        } else {
          window.location.href = "/jobseeker/dashboard";
        }
      }, 2000);
    } catch (err) {
      toast.error(err.message || "Login failed. Try again.");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="text-black dark:text-white w-full px-4 py-2 mt-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="text-black dark:text-white w-full px-4 py-2 mt-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Account Type Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Account Type
            </label>
            <div className="mt-2 flex items-center space-x-4">
              <div>
                <input
                  type="radio"
                  id="jobSeeker"
                  name="accountType"
                  value="jobSeeker"
                  checked={formData.accountType === "jobSeeker"}
                  onChange={handleAccountTypeChange}
                  className="mr-2"
                />
                <label
                  htmlFor="jobSeeker"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Job Seeker
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="employer"
                  name="accountType"
                  value="employer"
                  checked={formData.accountType === "employer"}
                  onChange={handleAccountTypeChange}
                  className="mr-2"
                />
                <label
                  htmlFor="employer"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Employer
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="cursor-pointer w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-semibold"
          >
            Login
          </button>
        </form>
        <div className="mt-3">
          <Link to={"/register"} className="text-green-500 dark:text-white">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
