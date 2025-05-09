import React, { useState, useEffect } from "react";
import { toast } from "react-toastify"; // Import toastify
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toastify

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

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/jobs`);
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

  const handleAddListing = async (e) => {
    e.preventDefault();
  
    // Get employerId from localStorage
    const employerId = localStorage.getItem("userId");

    // Log employerId to ensure it's being fetched correctly
    console.log("Employer ID from localStorage:", employerId);
    console.log(formData);
  
    if (!employerId) {
      console.error("Employer ID (userId) is not available in localStorage.");
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
      employerId: employerId, // Correctly pass employerId here
    };
  
    // Log newJob to make sure employerId is included
    console.log("Job data being sent:", newJob);
  
    try {
      const res = await fetch(`http://localhost:3000/api/jobs/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Authorization token
        },
        body: JSON.stringify(newJob), // Send new job data
      });
  
      if (!res.ok) {
        const errorResponse = await res.json();
        console.error("Error response:", errorResponse);
        toast.error("Failed to add job listing.");
        throw new Error("Failed to add job listing");
      }
  
      const data = await res.json();
      setJobListings([data.job, ...jobListings]);
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

      toast.success("Job listing added successfully!"); // Success message
    } catch (error) {
      console.error("Error adding job listing:", error);
      toast.error("Error adding job listing.");
    }
  };
  
  // delete job post
  const handleDelete = async (jobId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
  
      if (!res.ok) {
        throw new Error(`Failed to delete job. Status: ${res.status}`);
      }
  
      setJobListings((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      toast.success("Job deleted successfully!"); // Success message
    } catch (error) {
      console.error("Error deleting job:", error.message);
      toast.error("Error deleting job.");
    }
  };

  if (loading) {
    return <div>Loading job listings...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Add New Job Listing
      </h2>
      <form onSubmit={handleAddListing} className="grid gap-4 mb-10">
        <input
          id="jobTitle"
          type="text"
          placeholder="Job Title"
          value={formData.jobTitle}
          onChange={handleChange}
          required
          className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
        />
        <input
          id="jobType"
          type="text"
          placeholder="Job Type"
          value={formData.jobType}
          onChange={handleChange}
          required
          className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
        />
        <input
          id="category"
          type="text"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
          className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
        />
        <div className="flex gap-4">
          <input
            id="salaryMin"
            type="number"
            placeholder="Min Salary"
            value={formData.salaryMin}
            onChange={handleChange}
            required
            className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
          />
          <input
            id="salaryMax"
            type="number"
            placeholder="Max Salary"
            value={formData.salaryMax}
            onChange={handleChange}
            required
            className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
          />
        </div>
        <textarea
          id="jobDescription"
          placeholder="Job Description"
          value={formData.jobDescription}
          onChange={handleChange}
          required
          className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
        ></textarea>
        <input
          id="requirements"
          type="text"
          placeholder="Requirements (comma separated)"
          value={formData.requirements}
          onChange={handleChange}
          required
          className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
        />
        <input
          id="companyName"
          type="text"
          placeholder="Company Name"
          value={formData.companyName}
          onChange={handleChange}
          required
          className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
        />
        <input
          id="companyAddress"
          type="text"
          placeholder="Company Address"
          value={formData.companyAddress}
          onChange={handleChange}
          required
          className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
        />
        <textarea
          id="companyAbout"
          placeholder="About the Company"
          value={formData.companyAbout}
          onChange={handleChange}
          required
          className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
        ></textarea>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold"
        >
          Add Job
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        All Job Listings
      </h3>
      {jobListings.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No jobs listed yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {jobListings.map((job) => (
            <div
              key={job._id}
              className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow border dark:border-gray-700"
            >
              <h4 className="text-lg font-bold text-gray-800 dark:text-white">
                {job.jobTitle}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {job.jobDescription}
              </p>
              <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
                Location: {job.company.address}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Salary: {job.salaryRange.min} - {job.salaryRange.max}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleUpdate(job._id)}
                  className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(job._id)}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                >
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
