import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../navbar/navbar";

function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isload, setIsload] = useState(false);
  const navigate = useNavigate();
  const handleregister = async (e) => {
    setIsload(true);
    try {
      e.preventDefault();
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_BACKEND_URL}/api/haxplore/user/Register`,
        {
          username,
          email,
          password,
        }
      );
      toast.success(response.data.message);
      setIsload(false);
      navigate("/Signin");
    } catch (error) {
      console.log(error);
      if (error.response.data.message) toast.error(error.response.data.message);
      if (error.response.data.error) toast.error(error.response.data.error);
      setIsload(false);
    }
  };
  return (
    <>
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <Navbar />
        <div className="w-full max-w-md p-8 bg-white rounded shadow-md mt-4">
          <div className="flex flex-col items-center mb-6">
            <div className="text-blue-600 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m2 8H7a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Sign up</h2>
            <p className="text-gray-500">to join Docs</p>
          </div>
          <form className="space-y-4" onSubmit={handleregister}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="username"
                id="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  // console.log(email);
                }}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  // console.log(email);
                }}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  // console.log(email);
                }}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Create a password"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 "
              disabled={isload}
            >
              {isload ? <>🚫</> : <>Sign Up</>}
            </button>
            {isload ? (
              <>
                <div className=" justify-items-center ">
                  <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                </div>
              </>
            ) : (
              <></>
            )}
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}

export default SignUpPage;
