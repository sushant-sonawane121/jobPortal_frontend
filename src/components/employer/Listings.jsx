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
  const [currentJobId, setCurrentJobId] = useState(null);

  const userId = localStorage.getItem("userId");
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("https://jop-portal-backend-seven.vercel.app/api/jobs");
        const data = await res.json();
        const userJobs = data.filter((job) => job.employer === userId);
        setJobListings(userJobs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching job listings:", error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleAddOrUpdateJob = async (e) => {
    e.preventDefault();

    const jobPayload = {
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

    if (isUpdateMode && currentJobId) {
      try {
        const res = await fetch("https://jop-portal-backend-seven.vercel.app/api/jobs/updateJobByBodyId", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            id: currentJobId,
            _id: userId,
            ...jobPayload,
          }),
        });

        if (!res.ok) {
          toast.error("Failed to update job.");
          return;
        }

        const updated = await res.json();
        toast.success("Job updated successfully!");
        setJobListings((prev) =>
          prev.map((job) => (job._id === currentJobId ? updated.job : job))
        );
        resetForm();
      } catch (error) {
        toast.error("Update failed.");
      }
    } else {
      try {
        const res = await fetch("https://jop-portal-backend-seven.vercel.app/api/jobs/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            ...jobPayload,
            employerId: userId,
          }),
        });

        if (!res.ok) {
          toast.error("Failed to add job.");
          return;
        }

        const data = await res.json();
        setJobListings([data.job, ...jobListings]);
        toast.success("Job added successfully!");
        resetForm();
      } catch (error) {
        toast.error("Failed to add job.");
      }
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
        toast.error("Failed to delete job.");
        return;
      }

      setJobListings((prev) => prev.filter((job) => job._id !== jobId));
      toast.success("Job deleted.");
    } catch (error) {
      toast.error("Delete failed.");
    }
  };

  const handleUpdate = (jobId) => {
    const job = jobListings.find((j) => j._id === jobId);
    if (!job) return;

    setFormData({
      jobTitle: job.jobTitle || "",
      jobType: job.jobType || "",
      category: job.category || "",
      salaryMin: job.salaryRange?.min || "",
      salaryMax: job.salaryRange?.max || "",
      jobDescription: job.jobDescription || "",
      requirements: job.requirements?.join(",") || "",
      companyName: job.company?.name || "",
      companyAddress: job.company?.address || "",
      companyAbout: job.company?.about || "",
    });

    setIsUpdateMode(true);
    setCurrentJobId(jobId);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    setCurrentJobId(null);
  };

  if (loading) return <div className="p-6">Loading job listings...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{isUpdateMode ? "Update Job" : "Add New Job"}</h2>
      <form onSubmit={handleAddOrUpdateJob} className="grid gap-4 mb-10">
        <input id="jobTitle" type="text" placeholder="Job Title" value={formData.jobTitle} onChange={handleChange} required className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white" />
        <input id="jobType" type="text" placeholder="Job Type" value={formData.jobType} onChange={handleChange} required className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white" />
        <input id="category" type="text" placeholder="Category" value={formData.category} onChange={handleChange} required className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white" />
        <div className="flex gap-4">
          <input id="salaryMin" type="number" placeholder="Min Salary" value={formData.salaryMin} onChange={handleChange} required className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white w-full" />
          <input id="salaryMax" type="number" placeholder="Max Salary" value={formData.salaryMax} onChange={handleChange} required className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white w-full" />
        </div>
        <textarea id="jobDescription" placeholder="Job Description" value={formData.jobDescription} onChange={handleChange} required className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white" />
        <input id="requirements" type="text" placeholder="Requirements (comma separated)" value={formData.requirements} onChange={handleChange} required className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white" />
        <input id="companyName" type="text" placeholder="Company Name" value={formData.companyName} onChange={handleChange} required className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white" />
        <input id="companyAddress" type="text" placeholder="Company Address" value={formData.companyAddress} onChange={handleChange} required className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white" />
        <textarea id="companyAbout" placeholder="About the Company" value={formData.companyAbout} onChange={handleChange} required className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white" />
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold">
          {isUpdateMode ? "Update Job" : "Add Job"}
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-4">Your Job Listings</h3>
      {jobListings.length === 0 ? (
        <p className="text-gray-500">No jobs found for your account.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {jobListings.map((job) => (
            <div key={job._id} className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow border dark:border-gray-700">
              <h4 className="text-lg font-bold">{job.jobTitle}</h4>
              <p className="mt-2">{job.jobDescription}</p>
              <p className="text-sm mt-2 text-gray-500">Location: {job.company.address}</p>
              <p className="text-sm text-gray-500">Salary: {job.salaryRange.min} - {job.salaryRange.max}</p>
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
