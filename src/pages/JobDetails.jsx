import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaBuilding, FaClock } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { LuBuilding2 } from "react-icons/lu";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [empid, setEmpid] = useState("");
  const userId = localStorage.getItem("userId");
  const accountType = localStorage.getItem("accountType")?.toLowerCase(); // Normalize case
  const authToken = localStorage.getItem("authToken"); // Get token from localStorage
   
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`https://jop-portal-backend-seven.vercel.app/api/jobs/${id}`);
        const data = await response.json();
        setEmpid(data.employer._id);
        setJob(data.employer);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching job details:", error);
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleApply = async () => {
    if (!userId || accountType !== "jobseeker") {
      alert("Please log in as a job seeker to apply.");
      navigate("/login");
      return;
    }

    if (!authToken) {
      alert("You need to be logged in to apply.");
      navigate("/login");
      return;
    }

    try {
      setIsApplying(true);

      const response = await fetch(
        "https://jop-portal-backend-seven.vercel.app/api/jobseeker/apply",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`, // Add token to the headers
          },
          body: JSON.stringify({
            jobId: id,
            userId: userId,
            employerId:empid
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Successfully applied to job.");
      } else {
        alert(result.message || "Something went wrong while applying.");
      }
    } catch (err) {
      console.error("Apply error:", err);
      alert("Failed to apply.");
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) return <div>Loading job details...</div>;
  if (!job) return <div>Job not found.</div>;

  const {
    salaryRange,
    company,
    jobTitle,
    jobType,
    category,
    jobDescription,
    requirements,
    createdAt,
  } = job;

  const minSalary = salaryRange?.min || "N/A";
  const maxSalary = salaryRange?.max || "N/A";
  const jobRequirements = requirements || [];
  const companyDescription = company?.about || "No description available.";
  const jobLocation = company?.address || "Not specified";
  const jobCategory = category || "Not specified";

  const showApplyButton = userId && accountType === "jobseeker";

  return (
    <div className="min-h-screen p-5 text-black dark:text-white bg-white dark:bg-black">
      <section>
        <div className="mt-10">
          <div className="h-60 shadow-xl my-4 py-4 px-4 rounded-xl flex items-center justify-around flex-row bg-white dark:bg-gray-900">
            <div className="flex flex-col gap-3">
              <h2 className="text-xl sm:text-3xl font-semibold">
                {jobTitle || "Job Title Not Available"}
              </h2>

              <div className="flex flex-wrap gap-4 mt-2 text-gray-600 dark:text-gray-300 text-sm">
                <span className="flex gap-2 items-center">
                  <FaBuilding />
                  <p>{company?.name || "Company Name Not Available"}</p>
                </span>
                <span className="flex gap-2 items-center">
                  <FaLocationDot />
                  <p>{jobLocation}</p>
                </span>
              </div>

              <div className="flex flex-wrap gap-4 mt-3 text-sm">
                <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full px-3 py-1">
                  {jobType || "Job Type Not Specified"}
                </span>
                <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full px-3 py-1">
                  {jobCategory}
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center text-sm sm:text-base gap-3">
              <h3 className="font-bold text-green-600 text-lg sm:text-xl">
                ${minSalary} - ${maxSalary}
              </h3>
              <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <FaClock />
                <p>Posted {new Date(createdAt).toLocaleDateString()}</p>
              </span>
              {showApplyButton && (
                <button
                  onClick={handleApply}
                  disabled={isApplying}
                  className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                >
                  {isApplying ? "Applying..." : "Apply Now"}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="my-10">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
          <div className="w-full sm:w-2/1 border border-gray-300 dark:border-gray-700 rounded-xl p-5 bg-white dark:bg-gray-900 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Job Description</h2>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {jobDescription || "Job description not available."}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Requirements</h2>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-sm space-y-1">
                {jobRequirements.length > 0 ? (
                  jobRequirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))
                ) : (
                  <li>No specific requirements listed.</li>
                )}
              </ul>
            </div>
          </div>

          <div className="w-full border border-gray-300 dark:border-gray-700 rounded-xl p-5 bg-white dark:bg-gray-900 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Company Overview</h2>
            <div className="flex items-center gap-4">
              <div className="text-3xl text-blue-600 dark:text-blue-400">
                <LuBuilding2 />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {company?.name || "Company Name"}
                </h3>
                <h4 className="text-sm text-gray-600 dark:text-gray-300">
                  {jobLocation}
                </h4>
              </div>
            </div>
            <div className="mt-5">
              <p>{companyDescription}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default JobDetails;
