import React, { useState, useEffect } from "react";
import { FaSearch, FaBuilding, FaClock } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirect

function Jobs() {
  const [searchQuery, setSearchQuery] = useState(""); // Manage search input
  const [category, setCategory] = useState("All"); // Manage selected category
  const [jobListings, setJobListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize navigate for redirection

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const queryParams = new URLSearchParams();

        if (searchQuery) {
          queryParams.append("search", searchQuery);
        }

        if (category && category !== "All") {
          queryParams.append("category", category);
        }

        const res = await fetch(`http://localhost:3000/api/jobs?${queryParams.toString()}`);
        const data = await res.json();
        setJobListings(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching job listings:", error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchQuery, category]); // Refetch when search query or category changes

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleJobClick = (jobId) => {
    navigate(`/jobs/${jobId}`); // Redirect to the job's detail page
  };

  if (loading) {
    return <div>Loading job listings...</div>;
  }

  return (
    <div className="min-h-screen p-5 text-black dark:text-white bg-white dark:bg-black">
      {/* Search Bar Section */}
      <section>
        <h2 className="text-3xl font-semibold mb-4 text-center sm:text-left">
          Find Your Next Opportunity
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          {/* Search Input */}
          <span className="flex items-center w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 shadow-sm gap-2 bg-white dark:bg-gray-800">
            <FaSearch className="text-gray-600 dark:text-gray-300" />
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Search Jobs"
              className="w-full outline-none bg-transparent text-sm text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </span>

          {/* Category Dropdown */}
          <select
            className="w-full sm:w-40 border-2 border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 text-sm bg-white dark:bg-gray-800 text-black dark:text-white"
            value={category}
            onChange={handleCategoryChange}
          >
            <option value="All">All</option>
            <option value="development">Development</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>
      </section>

      {/* Jobs List Section */}
      <section>
        <div className="mt-10 cursor-pointer">
          {/* Render each job card */}
          {jobListings.map((job) => (
            <div
              key={job._id}
              className=" hover:scale-101 shadow-xl my-4 py-4 px-4 rounded-xl flex flex-row gap-4 bg-white dark:bg-gray-900"
              onClick={() => handleJobClick(job._id)} // Handle job click
            >
              {/* Left Side */}
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-semibold">{job.jobTitle}</h2>

                <div className="flex flex-wrap gap-4 mt-2 text-gray-600 dark:text-gray-300 text-sm">
                  <span className="flex gap-2 items-center">
                    <FaBuilding />
                    <p>{job.company.name}</p>
                  </span>
                  <span className="flex gap-2 items-center">
                    <FaLocationDot />
                    <p>{job.company.address}</p>
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 mt-3 text-sm">
                  <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full px-3 py-1">
                    {job.jobType}
                  </span>
                  <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full px-3 py-1">
                    {job.category}
                  </span>
                </div>
              </div>

              {/* Right Side */}
              <div className="flex flex-col justify-center text-sm sm:text-base gap-2">
                <h3 className="font-bold text-green-600 text-lg sm:text-xl">
                  ${job.salaryRange.min} - ${job.salaryRange.max}
                </h3>
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <FaClock />
                  <p>Posted {new Date(job.createdAt).toLocaleDateString()}</p>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Jobs;
