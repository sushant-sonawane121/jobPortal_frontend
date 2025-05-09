import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for redirecting
import { FaMoon, FaSun } from "react-icons/fa";

function Navbar() {
  const [isDark, setIsDark] = useState(localStorage.getItem("dark") === "true");
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("userId") !== null); // Check if user is logged in
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("dark", isDark);
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear all localStorage data
    setIsLoggedIn(false); // Update state to reflect that the user is logged out
    navigate("/"); // Redirect to home page
  };

  return (
    <nav className="bg-white dark:bg-gray-900">
      <div>
        <div className="flex items-center justify-between h-16 gap-4">
          <ul className="flex items-center space-x-4">
            <li>
              <Link
                to="/jobs"
                className="hover:underline text-black dark:text-white"
              >
                Jobs
              </Link>
            </li>
            {/* Conditionally render Login or Logout button */}
            {isLoggedIn ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="hover:underline text-black dark:text-white"
                >
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="hover:underline text-black dark:text-white"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
          <button
            onClick={toggleTheme}
            className="text-1xl cursor-pointer bg-gray-200 dark:bg-gray-700 text-black dark:text-white p-2 rounded-full"
          >
            {isDark ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
