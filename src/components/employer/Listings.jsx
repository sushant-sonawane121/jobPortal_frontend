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
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateJobId, setUpdateJobId] = useState(null);

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
  const [update, setUpdate] = useState(0);
  useEffect(() => {
    fetchJobs();
  }, [update]);

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
    setIsUpdating(false);
    setUpdateJobId(null);
    update = 0+1;
  };

  const handleAddListing = async (e) => {
    e.preventDefault();
    const employerId = localStorage.getItem("userId");

    if (!employerId) {
      toast.error("Employer ID not found.");
      return;
    }

    const newJob = {
      jobTitle: formData.jobTitle,
      jobType: formData.jobType,
      category: formData.category,
      jobDescription: formData.jobDescription,
      salaryRange: {
        min: formData.salaryMin,
        max: formData.salaryMax,
      },
      requirements: formData.requirements.split(","),
      company: {
        name: formData.companyName,
        address: formData.companyAddress,
        about: formData.companyAbout,
      },
      employerId: employerId,
    };

    try {
      const res = await fetch(`https://jop-portal-backend-seven.vercel.app/api/jobs/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(newJob),
      });

      if (!res.ok) throw new Error("Failed to add job listing");

      const data = await res.json();
      setJobListings([data.job, ...jobListings]);
      resetForm();
      toast.success("Job listing added successfully!");
    } catch (error) {
      console.error("Error adding job listing:", error);
      toast.error("Error adding job listing.");
    }
  };

  const handleDelete = async (jobId) => {
    try {
      const res = await fetch(`https://jop-portal-backend-seven.vercel.app/api/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!res.ok) throw new Error(`Failed to delete job`);

      setJobListings((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      toast.success("Job deleted successfully!");
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Error deleting job.");
    }
  };

  const handleUpdate = async (jobId) => {
    try {
      const res = await fetch(`https://jop-portal-backend-seven.vercel.app/api/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch job for update");

      const job = await res.json();

      setFormData({
        jobTitle: job.jobTitle,
        jobType: job.jobType,
        category: job.category,
        salaryMin: job.salaryRange.min,
        salaryMax: job.salaryRange.max,
        jobDescription: job.jobDescription,
        requirements: job.requirements.join(", "),
        companyName: job.company.name,
        companyAddress: job.company.address,
        companyAbout: job.company.about,
      });

      setIsUpdating(true);
      setUpdateJobId(job._id);
    } catch (error) {
      console.error("Error fetching job:", error);
      toast.error("Error loading job for update.");
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const employerId = localStorage.getItem("userId");

    const updatedJob = {
      _id: employerId,
      id: updateJobId,
      jobTitle: formData.jobTitle,
      jobType: formData.jobType,
      category: formData.category,
      jobDescription: formData.jobDescription,
      salaryRange: {
        min: formData.salaryMin,
        max: formData.salaryMax,
      },
      requirements: formData.requirements.split(","),
      company: {
        name: formData.companyName,
        address: formData.companyAddress,
        about: formData.companyAbout,
      },
    };

    try {
      const res = await fetch(`https://jop-portal-backend-seven.vercel.app/api/jobs/updateJobByBodyId`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(updatedJob),
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("Job updated successfully!");
      fetchJobs();
      resetForm();
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error("Failed to update job.");
    }
  };

  if (loading) {
    return <div>Loading job listings...</div>;
  }

  // ✅ Filter jobs by employer
  const currentUserId = localStorage.getItem("userId");
  const filteredJobs = jobListings.filter((job) => job.employer?._id === currentUserId);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        {isUpdating ? "Update Job Listing" : "Add New Job Listing"}
      </h2>
      <form onSubmit={isUpdating ? handleUpdateSubmit : handleAddListing} className="grid gap-4 mb-10">
        <input id="jobTitle" type="text" placeholder="Job Title" value={formData.jobTitle} onChange={handleChange} required className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white" />
        <input id="jobType" type="text" placeholder="Job Type" value={formData.jobType} onChange={handleChange} required className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white" />
        <input id="category" type="text" placeholder="Category" value={formData.category} onChange={handleChange} required className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white" />
        <div className="flex gap-4">
          <input id="salaryMin" type="number" placeholder="Min Salary" value={formData.salaryMin} onChange={handleChange} required className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white" />
          <input id="salaryMax" type="number" placeholder="Max Salary" value={formData.salaryMax} onChange={handleChange} required className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white" />
        </div>
        <textarea id="jobDescription" placeholder="Job Description" value={formData.jobDescription} onChange={handleChange} required className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white" />
        <input id="requirements" type="text" placeholder="Requirements (comma separated)" value={formData.requirements} onChange={handleChange} required className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white" />
        <input id="companyName" type="text" placeholder="Company Name" value={formData.companyName} onChange={handleChange} required className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white" />
        <input id="companyAddress" type="text" placeholder="Company Address" value={formData.companyAddress} onChange={handleChange} required className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white" />
        <textarea id="companyAbout" placeholder="About the Company" value={formData.companyAbout} onChange={handleChange} required className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white" />
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold">
          {isUpdating ? "Update Job" : "Add Job"}
        </button>
        {isUpdating && (
          <button type="button" onClick={resetForm} className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-md font-semibold mt-2">
            Cancel
          </button>
        )}
      </form>

      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Your Job Listings</h3>
      {filteredJobs.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No jobs listed yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <div key={job._id} className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow border dark:border-gray-700">
              <h4 className="text-lg font-bold text-gray-800 dark:text-white">{job.jobTitle}</h4>
              <p className="text-gray-600 dark:text-gray-300 mt-2">{job.jobDescription}</p>
              <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">Location: {job.company.address}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Salary: {job.salaryRange.min} - {job.salaryRange.max}</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => handleUpdate(job._id)} className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded">Update</button>
                <button onClick={() => handleDelete(job._id)} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Listings;
