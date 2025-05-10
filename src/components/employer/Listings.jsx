import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Listings() {
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobType: "",
    category: "",
    salaryMin: "",
    salaryMax: "",
    jobDescription: "",
    requirements: "",
    companyName: "",
    companyAddress: "",
    companyAbout: "",
  });

  const [jobListings, setJobListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [updateJobId, setUpdateJobId] = useState(null);
  const employerId = localStorage.getItem("userId");
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`https://jop-portal-backend-seven.vercel.app/api/jobs`);
        const data = await res.json();
        setJobListings(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching job listings:", error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      jobTitle: "",
      jobType: "",
      category: "",
      salaryMin: "",
      salaryMax: "",
      jobDescription: "",
      requirements: "",
      companyName: "",
      companyAddress: "",
      companyAbout: "",
    });
    setIsUpdateMode(false);
    setUpdateJobId(null);
  };

  const handleAddOrUpdateListing = async (e) => {
    e.preventDefault();

    if (!employerId) {
      toast.error("Employer ID not found in localStorage.");
      return;
    }

    const jobPayload = {
      jobTitle: formData.jobTitle,
      jobType: formData.jobType,
      category: formData.category,
      jobDescription: formData.jobDescription,
      requirements: formData.requirements.split(","),
      salaryRange: {
        min: formData.salaryMin,
        max: formData.salaryMax,
      },
      company: {
        name: formData.companyName,
        address: formData.companyAddress,
        about: formData.companyAbout,
      },
    };

    try {
      const url = isUpdateMode
        ? `https://jop-portal-backend-seven.vercel.app/api/jobs/updateJobByBodyId`
        : `https://jop-portal-backend-seven.vercel.app/api/jobs/create`;

      const method = isUpdateMode ? "PUT" : "POST";

      const body = isUpdateMode
        ? JSON.stringify({ ...jobPayload, _id: employerId, id: updateJobId })
        : JSON.stringify({ ...jobPayload, employerId });

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to process job listing.");
      }

      toast.success(data.message || "Success");

      if (isUpdateMode) {
        setJobListings((prev) =>
          prev.map((job) => (job._id === updateJobId ? data.job : job))
        );
      } else {
        setJobListings([data.job, ...jobListings]);
      }

      resetForm();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message);
    }
  };

  const handleDelete = async (jobId) => {
    try {
      const res = await fetch(`https://jop-portal-backend-seven.vercel.app/api/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete job.");
      }

      setJobListings((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      toast.success("Job deleted successfully!");
    } catch (error) {
      console.error("Error deleting job:", error.message);
      toast.error("Error deleting job.");
    }
  };

  const handleUpdate = async (jobId) => {
    try {
      const res = await fetch(`https://jop-portal-backend-seven.vercel.app/api/jobs/${jobId}`);
      const data = await res.json();

      setFormData({
        jobTitle: data.jobTitle,
        jobType: data.jobType,
        category: data.category,
        salaryMin: data.salaryRange.min,
        salaryMax: data.salaryRange.max,
        jobDescription: data.jobDescription,
        requirements: data.requirements.join(","),
        companyName: data.company.name,
        companyAddress: data.company.address,
        companyAbout: data.company.about,
      });

      setUpdateJobId(jobId);
      setIsUpdateMode(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      toast.error("Error loading job data for update.");
    }
  };

  if (loading) {
    return <div>Loading job listings...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        {isUpdateMode ? "Update Job Listing" : "Add New Job Listing"}
      </h2>
      <form onSubmit={handleAddOrUpdateListing} className="grid gap-4 mb-10">
        <input id="jobTitle" type="text" placeholder="Job Title" value={formData.jobTitle} onChange={handleChange} required className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white" />
        <input id="jobType" type="text" placeholder="Job Type" value={formData.jobType} onChange={handleChange} required className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white" />
        <input id="category" type="text" placeholder="Category" value={formData.category} onChange={handleChange} required className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white" />
        <div className="flex gap-4">
          <input id="salaryMin" type="number" placeholder="Min Salary" value={formData.salaryMin} onChange={handleChange} required className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white w-full" />
          <input id="salaryMax" type="number" placeholder="Max Salary" value={formData.salaryMax} onChange={handleChange} required className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white w-full" />
        </div>
        <textarea id="jobDescription" placeholder="Job Description" value={formData.jobDescription} onChange={handleChange} required className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"></textarea>
        <input id="requirements" type="text" placeholder="Requirements (comma separated)" value={formData.requirements} onChange={handleChange} required className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white" />
        <input id="companyName" type="text" placeholder="Company Name" value={formData.companyName} onChange={handleChange} required className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white" />
        <input id="companyAddress" type="text" placeholder="Company Address" value={formData.companyAddress} onChange={handleChange} required className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white" />
        <textarea id="companyAbout" placeholder="About the Company" value={formData.companyAbout} onChange={handleChange} required className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"></textarea>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold">
          {isUpdateMode ? "Update Job" : "Add Job"}
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Your Job Listings</h3>
      {jobListings.filter((job) => job.employer === employerId).length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No jobs listed yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {jobListings
            .filter((job) => job.employer === employerId)
            .map((job) => (
              <div key={job._id} className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow border dark:border-gray-700">
                <h4 className="text-lg font-bold text-gray-800 dark:text-white">{job.jobTitle}</h4>
                <p className="text-gray-600 dark:text-gray-300 mt-2">{job.jobDescription}</p>
                <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">Location: {job.company.address}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Salary: {job.salaryRange.min} - {job.salaryRange.max}</p>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => handleUpdate(job._id)} className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded">
                    Update
                  </button>
                  <button onClick={() => handleDelete(job._id)} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded">
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default Listings;
