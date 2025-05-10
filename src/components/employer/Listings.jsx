import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Listings = () => {
  const [jobListings, setJobListings] = useState([]);
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
  const [editingJobId, setEditingJobId] = useState(null);

  const fetchJobs = async () => {
    try {
      const employerId = localStorage.getItem("userId");
      const res = await fetch(`https://jop-portal-backend-seven.vercel.app/api/jobs/employer/${employerId}`);
      const data = await res.json();
      setJobListings(data.jobs);
    } catch (error) {
      toast.error("Failed to fetch jobs.");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const employerId = localStorage.getItem("userId");

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
      employerId: employerId,
    };

    try {
      let res;
      if (editingJobId) {
        res = await fetch(`https://jop-portal-backend-seven.vercel.app/api/jobs/${editingJobId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(jobPayload),
        });
      } else {
        res = await fetch(`https://jop-portal-backend-seven.vercel.app/api/jobs/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(jobPayload),
        });
      }

      if (!res.ok) {
        toast.error(editingJobId ? "Failed to update job." : "Failed to add job.");
        return;
      }

      const data = await res.json();

      if (editingJobId) {
        setJobListings((prev) =>
          prev.map((job) => (job._id === editingJobId ? data : job))
        );
        toast.success("Job updated successfully!");
      } else {
        setJobListings([data.job, ...jobListings]);
        toast.success("Job added successfully!");
      }

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
      setEditingJobId(null);
    } catch (error) {
      toast.error("Error occurred while submitting job.");
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

      if (!res.ok) {
        toast.error("Failed to delete job.");
        return;
      }

      setJobListings(jobListings.filter((job) => job._id !== jobId));
      toast.success("Job deleted successfully!");
    } catch (error) {
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
        requirements: data.requirements.join(", "),
        companyName: data.company.name,
        companyAddress: data.company.address,
        companyAbout: data.company.about,
      });

      setEditingJobId(jobId);
    } catch (error) {
      toast.error("Failed to fetch job details for editing.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold text-center">
        {editingJobId ? "Update Job Listing" : "Create a Job Listing"}
      </h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-md p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" name="jobTitle" placeholder="Job Title" value={formData.jobTitle} onChange={handleChange} required className="input" />
          <input type="text" name="jobType" placeholder="Job Type" value={formData.jobType} onChange={handleChange} required className="input" />
          <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required className="input" />
          <input type="number" name="salaryMin" placeholder="Min Salary" value={formData.salaryMin} onChange={handleChange} required className="input" />
          <input type="number" name="salaryMax" placeholder="Max Salary" value={formData.salaryMax} onChange={handleChange} required className="input" />
          <input type="text" name="requirements" placeholder="Requirements (comma separated)" value={formData.requirements} onChange={handleChange} className="input" />
          <input type="text" name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleChange} className="input" />
          <input type="text" name="companyAddress" placeholder="Company Address" value={formData.companyAddress} onChange={handleChange} className="input" />
        </div>
        <textarea name="jobDescription" placeholder="Job Description" value={formData.jobDescription} onChange={handleChange} rows="4" className="w-full border rounded-md p-2" />
        <textarea name="companyAbout" placeholder="About Company" value={formData.companyAbout} onChange={handleChange} rows="3" className="w-full border rounded-md p-2" />
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold">
          {editingJobId ? "Update Job" : "Add Job"}
        </button>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Your Job Listings</h2>
        {jobListings.length === 0 && <p>No job listings found.</p>}
        {jobListings.map((job) => (
          <div key={job._id} className="bg-white border rounded-md p-4 shadow-md space-y-2">
            <h3 className="text-lg font-semibold">{job.jobTitle}</h3>
            <p className="text-gray-600">{job.category} | {job.jobType}</p>
            <p className="text-gray-600">Salary: ${job.salaryRange.min} - ${job.salaryRange.max}</p>
            <div className="flex gap-4 mt-2">
              <button onClick={() => handleUpdate(job._id)} className="px-4 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
                Update
              </button>
              <button onClick={() => handleDelete(job._id)} className="px-4 py-1 bg-red-600 text-white rounded-md hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Listings;
