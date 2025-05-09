import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

function Header() {
  return (
    <header className="w-full shadow-xl px-2 py-1 bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          JobPortal
        </Link>
        <Navbar />
      </div>
    </header>
  );
}

export default Header;
