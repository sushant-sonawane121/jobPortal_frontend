// --- Backend: Controller for Updating Job ---
// File: controllers/jobController.js

const Job = require("../models/jobModel");

// Update Job by ID
const updateJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedJob = await Job.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ message: "Job updated successfully", job: updatedJob });
  } catch (error) {
    res.status(500).json({ message: "Error updating job", error: error.message });
  }
};

module.exports = { updateJobById };


// --- Backend: Route ---
// File: routes/job.routes.js

const express = require("express");
const router = express.Router();
const { updateJobById } = require("../controllers/jobController");

// ... other routes

router.put("/:id", updateJobById);

module.exports = router;


// --- Frontend: Listings.js ---

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
  const [editingJobId, setEditingJobId] = useState(null);

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

  const handleEdit = async (jobId) => {
    try {
      const res = await fetch(`https://jop-portal-backend-seven.vercel.app/api/jobs/${jobId}`);
      const data = await res.json();
      const job = data;

      setFormData({
        jobTitle: job.jobTitle,
        jobType: job.jobType,
        category: job.category,
        salaryMin: job.salaryRange.min,
        salaryMax: job.salaryRange.max,
        jobDescription: job.jobDescription,
        requirements: job.requirements.join(","),
        companyName: job.company.name,
        companyAddress: job.company.address,
        companyAbout: job.company.about,
      });
      setEditingJobId(jobId);
    } catch (error) {
      console.error("Error fetching job to edit:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const employerId = localStorage.getItem("userId");
    const authToken = localStorage.getItem("authToken");

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
      const url = editingJobId
        ? `https://jop-portal-backend-seven.vercel.app/api/jobs/${editingJobId}`
        : `https://jop-portal-backend-seven.vercel.app/api/jobs/create`;

      const method = editingJobId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(jobPayload),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.message || "Operation failed");
        return;
      }

      const data = await res.json();
      toast.success(editingJobId ? "Job updated successfully!" : "Job added successfully!");
      setEditingJobId(null);
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
      setJobListings(await (await fetch(`https://jop-portal-backend-seven.vercel.app/api/jobs`)).json());
    } catch (error) {
      console.error("Error:", error);
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

      if (!res.ok) throw new Error("Failed to delete");

      setJobListings(jobListings.filter((job) => job._id !== jobId));
      toast.success("Deleted successfully");
    } catch (err) {
      toast.error("Failed to delete job");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{editingJobId ? "Update Job" : "Add New Job"}</h2>
      <form onSubmit={handleSubmit} className="grid gap-4 mb-10">
        <input id="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="Job Title" required />
        <input id="jobType" value={formData.jobType} onChange={handleChange} placeholder="Job Type" required />
        <input id="category" value={formData.category} onChange={handleChange} placeholder="Category" required />
        <div className="flex gap-4">
          <input id="salaryMin" value={formData.salaryMin} onChange={handleChange} placeholder="Min Salary" type="number" required />
          <input id="salaryMax" value={formData.salaryMax} onChange={handleChange} placeholder="Max Salary" type="number" required />
        </div>
        <textarea id="jobDescription" value={formData.jobDescription} onChange={handleChange} placeholder="Job Description" required></textarea>
        <input id="requirements" value={formData.requirements} onChange={handleChange} placeholder="Requirements (comma-separated)" required />
        <input id="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name" required />
        <input id="companyAddress" value={formData.companyAddress} onChange={handleChange} placeholder="Company Address" required />
        <textarea id="companyAbout" value={formData.companyAbout} onChange={handleChange} placeholder="About the Company" required></textarea>
        <button type="submit" className="bg-blue-600 text-white py-2 rounded">
          {editingJobId ? "Update Job" : "Add Job"}
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-4">All Job Listings</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {jobListings.map((job) => (
          <div key={job._id} className="border rounded p-4">
            <h4 className="text-lg font-bold">{job.jobTitle}</h4>
            <p>{job.jobDescription}</p>
            <p>Salary: {job.salaryRange.min} - {job.salaryRange.max}</p>
            <p>Location: {job.company.address}</p>
            <div className="mt-2 flex gap-2">
              <button onClick={() => handleEdit(job._id)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
              <button onClick={() => handleDelete(job._id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Listings;
