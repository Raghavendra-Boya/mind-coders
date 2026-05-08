"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  setSignupFormData, 
  setLoginFormData, 
  signupUser, 
  loginUser,
  resetSignupForm,
  resetLoginForm
} from "../store/slices/authSlice";

export default function AuthForm({ isSignupProp, closeForm }) {
  const dispatch = useDispatch();
  
  // Get state from Redux store
  const { 
    signupFormData, 
    loginFormData, 
    signupLoading, 
    loginLoading, 
    signupStatus, 
    loginStatus 
  } = useSelector((state) => state.auth);

  // Use appropriate form data based on form type
  const formData = isSignupProp ? signupFormData : loginFormData;
  const loading = isSignupProp ? signupLoading : loginLoading;
  const message = isSignupProp ? signupStatus : loginStatus;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (isSignupProp) {
      dispatch(setSignupFormData({ [name]: value }));
    } else {
      dispatch(setLoginFormData({ [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSignupProp) {
      // Dispatch signup action
      const result = await dispatch(signupUser({
        name: formData.name,
        email: formData.email,
        mobileNo: formData.mobileNo,
        source: 0,
      }));
      
      if (signupUser.fulfilled.match(result)) {
        // Close modal after successful signup
        setTimeout(() => {
          closeForm();
          dispatch(resetSignupForm());
        }, 2000);
      }
    } else {
      // Dispatch login action
      const result = await dispatch(loginUser({
        userName: formData.userName,
        source: 0,
      }));
      
      if (loginUser.fulfilled.match(result)) {
        // Close modal after successful login
        setTimeout(() => {
          closeForm();
          dispatch(resetLoginForm());
        }, 2000);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mt-2 text-gray-700">
      {isSignupProp && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="example@email.com"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mobile No</label>
            <input
              type="text"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleChange}
              required
              placeholder="1234567890"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </>
      )}

      {!isSignupProp && (
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            required
            placeholder="Enter your username"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      )}

      {message && (
        <p className={`text-center text-sm ${message.includes("successful") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
      >
        {loading ? "Processing..." : (isSignupProp ? "Sign Up" : "Login")}
      </button>
    </form>
  );
}
