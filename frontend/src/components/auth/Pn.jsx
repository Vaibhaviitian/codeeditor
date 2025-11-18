import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const PhoneNumberPage = () => {
  const [phonenumber, setphonenumber] = useState("");
  const [isload, setisload] = useState(false);
  const navigate = useNavigate();

  // Handle mobile number input change
  const handleMobileChange = (e) => {
    const value = e.target.value;
    if (isNaN(value)) return; // Allow only numbers
    setphonenumber(value);
  };

  // Handle "Get OTP" button click
  const handleGetOtp = async () => {
    setisload(true);
    if (phonenumber.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    let s = "+91" + phonenumber;
    localStorage.setItem("pn", s);
    setphonenumber(s);
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_REACT_BACKEND_URL
        }/api/haxplore/user/sendingOTP`,
        {
          phonenumber: s,
        }
      );


      // Navigate only if OTP is successfully sent
      if (response.data.status == 200) {
        navigate("/OTPverification");
      } else {
        setisload(false);
        toast.error("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      setisload(false);
      console.error("Error sending OTP:", error);
      toast.error(`Something went wrong! ${error.response.data.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login with OTP</h1>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter Mobile Number
        </label>
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <span className="px-4 py-2 bg-gray-100 text-gray-700">+91</span>
          <input
            type="text"
            value={phonenumber}
            onChange={handleMobileChange}
            maxLength="10"
            placeholder="1234567890"
            className="w-full px-4 py-2 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          onClick={handleGetOtp}
          disabled={isload}
          className="w-full mt-6 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 cursor-pointer"
        >
          {isload ? <>Getting OTP... 🚫</> : <>Get OTP</>}
        </button>
        {isload ? (
          <>
            {" "}
            <div className="justify-items-center mt-3">
              <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default PhoneNumberPage;
