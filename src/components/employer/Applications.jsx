import React, { useState, useEffect } from "react";

function Applications() {
  // Sample static data (replace with API call later)
  const [applications, setApplications] = useState([
    {
      id: "1",
      jobSeekerName: "Amit Sharma",
      jobSeekerId: "JS101",
      jobTitle: "Frontend Developer",
      status: "pending",
    },
    {
      id: "2",
      jobSeekerName: "Neha Patel",
      jobSeekerId: "JS102",
      jobTitle: "Backend Developer",
      status: "pending",
    },
  ]);

  const handleStatusChange = (id, newStatus) => {
    const updated = applications.map((app) =>
      app.id === id ? { ...app, status: newStatus } : app
    );
    setApplications(updated);
    // TODO: Send update to backend
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Job Applications
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-left">
              <th className="py-3 px-4">Job Seeker Name</th>
              <th className="py-3 px-4">Job Seeker ID</th>
              <th className="py-3 px-4">Job Title</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr
                key={app.id}
                className="border-t border-gray-200 dark:border-gray-700"
              >
                <td className="py-3 px-4 text-gray-800 dark:text-gray-100">
                  {app.jobSeekerName}
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                  {app.jobSeekerId}
                </td>
                <td className="py-3 px-4 text-gray-700 dark:text-gray-200">
                  {app.jobTitle}
                </td>
                <td className="py-3 px-4">
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    className="px-3 py-1 rounded border dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approve</option>
                    <option value="rejected">Reject</option>
                  </select>
                </td>
              </tr>
            ))}
            {applications.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-6 text-gray-500 dark:text-gray-400"
                >
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Applications;
