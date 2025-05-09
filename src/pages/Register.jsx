import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    accountType: "jobSeeker",
    companyName: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint =
      formData.accountType === "employer"
        ? "http://localhost:3000/api/employer/register"
        : "http://localhost:3000/api/jobseeker/register";

    try {
      console.log("Form Data:", formData);

      const bodyData = {
        fullName: formData.fullname,
        email: formData.email,
        password: formData.password,
        accountType: formData.accountType,
      };

      if (formData.accountType === "employer") {
        bodyData.companyName = formData.companyName;
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      console.log("Response:", res);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Registration failed");
      }

      await res.json();
      toast.success("Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Error:", err.message);
      toast.error(err.message || "Registration failed. Try again.");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Create Account
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="fullname"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="text-black dark:text-white w-full px-4 py-2 mt-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2"
              placeholder="Enter your full name"
              required
            />
          </div>
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
          <div className="mb-4">
            <label
              htmlFor="accountType"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Account Type
            </label>
            <select
              id="accountType"
              value={formData.accountType}
              onChange={handleChange}
              className="text-black dark:text-white w-full px-4 py-2 mt-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="jobSeeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
          </div>

          {formData.accountType === "employer" && (
            <div className="mb-4">
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Company Name
              </label>
              <input
                type="text"
                id="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="text-black dark:text-white w-full px-4 py-2 mt-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2"
                placeholder="Enter your company name"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="cursor-pointer w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-semibold"
          >
            Register
          </button>
        </form>
        <div className="mt-3">
          <Link to={"/login"} className="text-green-500 dark:text-white">
            Login Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
