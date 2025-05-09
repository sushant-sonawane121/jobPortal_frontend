import React from "react";

function Analysis() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Employer Dashboard - Analysis
      </h2>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Listings</p>
          <p className="text-2xl font-bold text-blue-600">12</p>
        </div>
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Applications</p>
          <p className="text-2xl font-bold text-green-600">87</p>
        </div>
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Shortlisted</p>
          <p className="text-2xl font-bold text-yellow-600">23</p>
        </div>
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Rejected</p>
          <p className="text-2xl font-bold text-red-600">14</p>
        </div>
      </div>

      {/* Placeholder Chart Section */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Application Trends
        </h3>
        <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
          {/* Placeholder for a real chart component */}
          <span>Chart Coming Soon...</span>
        </div>
      </div>
    </div>
  );
}

export default Analysis;
