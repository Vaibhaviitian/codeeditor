import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../navbar/navbar";
import axios from "axios";

function ResetPass() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  // 🔹 Handler to reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${
          import.meta.env.VITE_REACT_BACKEND_URL
        }/api/haxplore/user/updatepassword`,
        { newpassword: password, token: token }
      );
      toast.success(res.data.message || "Password reset successful!");
      setIsLoading(false);

      // Navigate to login page after 2 seconds
      setTimeout(() => navigate("/signin"), 2000);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Error resetting password");
      setIsLoading(false);
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
                  d="M12 11c0-.943-.757-1.7-1.7-1.7H8.7C7.757 9.3 7 10.057 7 11v5c0 .943.757 1.7 1.7 1.7h1.6c.943 0 1.7-.757 1.7-1.7V11zm5 0c0-.943-.757-1.7-1.7-1.7h-1.6c-.943 0-1.7.757-1.7 1.7v5c0 .943.757 1.7 1.7 1.7h1.6c.943 0 1.7-.757 1.7-1.7V11z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Reset your password
            </h2>
            <p className="text-gray-500">Enter your new password below</p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                required
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                required
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>

            {isLoading && (
              <div className="flex justify-center mt-4">
                <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
              </div>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Remembered your password?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login here
            </a>
          </p>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}

export default ResetPass;
