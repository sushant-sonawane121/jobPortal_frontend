import React, { useState, useEffect } from "react";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobTitles, setJobTitles] = useState({}); // Store job titles by jobId

  const fetchJobTitle = async (jobId) => {
    try {
      const res = await fetch(`https://jop-portal-backend-seven.vercel.app/api/jobs?_id=${jobId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch job title.");
      }
      const jobData = await res.json();
      // console.log(jobData);

      // Loop through jobData array and match the jobId to get the correct jobTitle
      if (jobData && jobData.length > 0) {
        const job = jobData.find((item) => item._id === jobId); // Match jobId
        if (job) {
          setJobTitles((prev) => ({
            ...prev,
            [jobId]: job.jobTitle, // Store jobTitle by jobId
          }));
        }
      }
    } catch (err) {
      console.error("Error fetching job title:", err.message);
    }
  };

  const fetchApplications = async () => {
    const employerId = localStorage.getItem("userId");
    const token = localStorage.getItem("authToken");

    if (!employerId || !token) {
      console.error("Missing employer ID or token.");
      return;
    }

    try {
      const res = await fetch("https://jop-portal-backend-seven.vercel.app/api/employer/getjobseakerappliedjob", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Optional if you use auth middleware
        },
        body: JSON.stringify({ employerId }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch applications.");
      }

      const data = await res.json();
      setApplications(data);

      // Fetch job titles for each jobId in the applications
      data.forEach((app) => {
        // Only fetch the job title if it hasn't already been fetched
        if (!jobTitles[app.jobId]) {
          fetchJobTitle(app.jobId);
        }
      });
    } catch (err) {
      console.error("Error fetching applications:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    const updated = applications.map((app) =>
      app.jobId === id ? { ...app, status: newStatus } : app
    );
    setApplications(updated);

    // TODO: Send updated status to backend here
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
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Job Title</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {!loading && applications.length > 0 ? (
              applications.map((app, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-200 dark:border-gray-700"
                >
                  <td className="py-3 px-4 text-gray-800 dark:text-gray-100">
                    {app.fullName}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {app.email}
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-200">
                    {/* Show the job title, or loading message until the title is fetched */}
                    {jobTitles[app.jobId] || "Loading..."}
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-200">
                    {app.status}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={app.status}
                      onChange={(e) =>
                        handleStatusChange(app.jobId, e.target.value)
                      }
                      className="px-3 py-1 rounded border dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approve</option>
                      <option value="rejected">Reject</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500 dark:text-gray-400"
                >
                  {loading ? "Loading..." : "No applications found."}
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
