import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../navbar/navbar";

function ForgotPass() {
  const [email, setEmail] = useState("");
  const [isLoad, setIsLoad] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    try {
      setIsLoad(true);
      const response = await axios.post(
        `${
          import.meta.env.VITE_REACT_BACKEND_URL
        }/api/haxplore/user/forgotpassword`,
        { email }
      );
      toast.success(response.data.message || "Reset link sent to your email!");
      setEmail("");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to send reset email."
      );
    } finally {
      setIsLoad(false);
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
            <h2 className="text-2xl font-bold text-gray-800">
              Forgot Password
            </h2>
            <p className="text-gray-500">
              Enter your email to receive a reset link
            </p>
          </div>

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                required
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your registered email"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              disabled={isLoad}
            >
              {isLoad ? "Sending..." : "Send Mail"}
            </button>

            {isLoad && (
              <div className="flex justify-center mt-4">
                <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
              </div>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Remembered your password?{" "}
            <Link to="/signin" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}

export default ForgotPass;
