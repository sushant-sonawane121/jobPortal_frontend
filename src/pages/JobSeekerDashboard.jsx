import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import MyApplications from "../components/jobseaker/MyApplications";

function JobSeekerDashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState("MyApplications");
  const navigate = useNavigate();

  const sections = {
    MyApplications: <MyApplications />,
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const accountType = localStorage.getItem("accountType");

    // Check if the user is logged in and if the account type is 'jobSeeker'
    if (!token || accountType !== "jobSeeker") {
      navigate("/login"); // Redirect to login if not logged in or account type is not jobSeeker
    }
  }, [navigate]);

  return (
    <section className="flex min-h-screen bg-white dark:bg-black text-black dark:text-white relative">
      {/* Sidebar */}
      <aside
        className={`fixed top-16 sm:top-4 left-0 z-30 h-full w-64 bg-gray-100 dark:bg-gray-800 shadow-md transform transition-transform duration-300 ease-in-out rounded-none sm:rounded-lg
        ${drawerOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0 sm:relative`}
      >
        {/* Close button for mobile */}
        <div className="p-4 flex justify-between items-center sm:hidden border-b border-gray-300 dark:border-gray-700">
          <h2 className="font-bold text-lg">Menu</h2>
          <button onClick={() => setDrawerOpen(false)}>
            <MdClose size={24} />
          </button>
        </div>

        <nav className="p-4 pt-6 space-y-4">
          {["MyApplications"].map((section) => (
            <button
              key={section}
              onClick={() => {
                setCurrentSection(section);
                setDrawerOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                currentSection === section
                  ? "bg-gray-300 dark:bg-gray-700 font-semibold"
                  : ""
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </nav>
      </aside>

      {/* Hamburger Menu */}
      {!drawerOpen && (
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="sm:hidden fixed top-20 left-4 z-40 bg-gray-100 dark:bg-gray-800 p-2 rounded shadow-md"
        >
          <FaBars size={24} />
        </button>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 mt-16 sm:mt-4 sm:ml-64 transition-all duration-300">
        {sections[currentSection]}
      </main>
    </section>
  );
}

export default JobSeekerDashboard;
