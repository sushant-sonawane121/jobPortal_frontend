import React from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaBriefcase, FaRocket } from "react-icons/fa";
import { FaQuestion } from "react-icons/fa";

function Home() {
  // Check if the user is logged in by checking the 'userId' in localStorage
  const isLoggedIn = localStorage.getItem("userId") !== null;

  return (
    <div className="w-full bg-white dark:bg-gray-900 text-black dark:text-white relative">
      {/* Hero Section */}
      <section className="px-6 py-16 max-w-6xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Find Your Dream Job Today
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Find Thousands of Jobs On Single Platform
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/jobs"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold"
          >
            Browse Jobs
          </Link>
          {/* Conditionally render the Login/Register button based on the login status */}
          {!isLoggedIn && (
            <Link
              to="/login"
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-white rounded-md font-semibold"
            >
              Login / Register
            </Link>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="px-6 py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">What We Offer</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Everything you need to find or post jobs quickly and effectively.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
            <FaSearch className="text-blue-600 dark:text-blue-400 text-3xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Job Search</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Explore thousands of listings from trusted companies.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
            <FaBriefcase className="text-blue-600 dark:text-blue-400 text-3xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Post Jobs</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Employers can easily list openings and find top talent.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
            <FaRocket className="text-blue-600 dark:text-blue-400 text-3xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Easy Apply</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Save your profile and apply to jobs in just a few clicks.
            </p>
          </div>
        </div>
      </section>

      <Link
        to={"/contact"}
        className="fixed animate-pulse right-10 bottom-20 flex flex-col items-center"
      >
        <FaQuestion className="text-4xl" />
        <p>Any Question</p>
      </Link>
    </div>
  );
}

export default Home;
