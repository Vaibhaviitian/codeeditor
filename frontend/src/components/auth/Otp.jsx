import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Navbar from "../navbar/navbar";
const OTPPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to the next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  let phonenumber = localStorage.getItem("pn");
  const handleSubmit = async () => {
    const enteredOtp = otp.join("");
    let phonenumber = localStorage.getItem("pn");

    if (!phonenumber || otp.includes("") || otp.includes(undefined)) {
      toast.error("Invalid phone number or OTP.");
      return;
    }
    try {
      let id = localStorage.getItem("itemhai");
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_BACKEND_URL}/api/haxplore/user/checkingOTP`,
        {
          id,
          phonenumber,
          otp: enteredOtp,
        }
      );
      if (response.data.ans == "true"){
        toast.success(response.data.message);
        navigate("/editor");
      }
      else toast.error("Invalid OTP.");
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message);     
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Navbar />
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Enter OTP</h1>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter the OTP sent to your mobile number
        </label>
        <div className="flex space-x-4 justify-center">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-12 h-12 text-center text-xl border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="w-full mt-6 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Submit OTP
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default OTPPage;