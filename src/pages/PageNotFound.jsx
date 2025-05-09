import React from "react";
import { Link } from "react-router-dom";
function PageNotFound() {
  return (
    <>
      <div className="h-screen w-screen bg-blue-100 flex justify-center items-center flex-col font-bold gap-2">
        <h1 className="text-5xl text-red-500">Error 404</h1>
        <h3 className="text-2xl">Page Not Found</h3>
        <p>The page you searching for is not found or may be removed!</p>
        <div className="mt-5">
          <Link
            to={"/"}
            className="border border-green-500 text-2xl py-2 px-5 bg-green-500 rounded"
          >
            Home
          </Link>
        </div>
      </div>
    </>
  );
}

export default PageNotFound;
