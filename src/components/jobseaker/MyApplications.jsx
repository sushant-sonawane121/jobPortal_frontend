import React, { useEffect, useState } from "react";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch job details based on jobId
  const fetchJobDetails = async (jobId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/jobs?_id=${jobId}`);
      if (!res.ok) throw new Error("Failed to fetch job details");
      const job = await res.json();
      return job[0]; // Assuming the job details are returned as an array
    } catch (err) {
      console.error("Error fetching job details:", err);
      return null;
    }
  };

  // Function to fetch company name using POST with employerId in body
  const fetchCompanyName = async (employerId) => {
    
    try {
      const res = await fetch("http://localhost:3000/api/employer/getEmployer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employerId }),
        
      });

      if (!res.ok) throw new Error("Failed to fetch employer details");
      const employer = await res.json();
      return employer?.companyName || "Unknown Company";
    } catch (err) {
      console.error("Error fetching employer details:", err);
      return "Unknown Company";
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const userId = localStorage.getItem("userId");

        const res = await fetch("http://localhost:3000/api/jobseeker/appliedjobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId }),
        });

        if (!res.ok) throw new Error("Failed to fetch applied jobs");

        const data = await res.json();

        // Fetch job and employer details for each application
        const applicationsWithDetails = await Promise.all(
          data.map(async (application) => {
            const jobDetails = await fetchJobDetails(application.jobId);
            const companyName = await fetchCompanyName(application.employerId);

            return {
              ...application,
              jobTitle: jobDetails?.jobTitle || "Unknown Title",
              companyName: companyName || "Unknown Company",
            };
          })
        );

        setApplications(applicationsWithDetails);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">My Applied Jobs</h2>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-blue-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Job Title</th>
                <th className="px-4 py-2 text-left">Company Name</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.length > 0 ? (
                applications.map((app, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 text-black">{app.jobTitle}</td>
                    <td className="px-4 py-2 text-black">{app.companyName}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-block px-2 py-1 text-sm rounded ${
                          app.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : app.status === "Accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="px-4 py-4 text-center text-gray-500"
                    colSpan="3"
                  >
                    No applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyApplications;
