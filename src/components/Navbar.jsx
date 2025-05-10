import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";

function Navbar() {
  localStorage.setItem("dark", true);
  const [isDark, setIsDark] = useState(localStorage.getItem("dark") === "true");
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("userId") !== null);
  const [dashboardLink, setDashboardLink] = useState(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    const accountType = localStorage.getItem("accountType");
    if (accountType === "jobSeeker") {
      setDashboardLink("/jobseeker/dashboard");
    } else if (accountType === "employer") {
      setDashboardLink("/employer/dashboard");
    } else {
      setDashboardLink(null);
    }
  }, [isLoggedIn]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    window.location.href = "/"; // Full page reload on logout
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

            {dashboardLink && (
              <li>
                <Link
                  to={dashboardLink}
                  className="hover:underline text-black dark:text-white"
                >
                  Dashboard
                </Link>
              </li>
            )}

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
