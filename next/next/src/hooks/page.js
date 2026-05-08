"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SlotBooking() {
 const [formData, setFormData] = useState({
  fullName: "",
  mobileNo: "",
  email: "",
  location: "",
  fromDate: "",    // For UI date range
  toDate: "",      // For UI date range
  slotBookingDate: "", // Will be set from fromDate before submission
  slotBookingTime: "",
  message: "",
});

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

const validate = () => {
  const newErrors = {};

  // Required field validations
  if (!formData.fullName.trim()) {
    newErrors.fullName = "Full name is required";
  }

  if (!formData.mobileNo) {
    newErrors.mobileNo = "Phone number is required";
  } else if (!/^\d{10}$/.test(formData.mobileNo)) {
    newErrors.mobileNo = "Phone number must be 10 digits";
  }

  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    newErrors.email = "Please enter a valid email";
  }

  if (!formData.location.trim()) {
    newErrors.location = "Location is required";
  }

  // Only validate fromDate since that's what we're saving
  if (!formData.fromDate) {
    newErrors.fromDate = "Please select a start date";
  }

  // Validate time
  if (!formData.slotBookingTime) {
    newErrors.slotBookingTime = "Please select a time";
  }

  if (!formData.message.trim()) {
    newErrors.message = "Message is required";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  // ✅ Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Restrict digits for phone number
    if (name === "mobileNo") {
      if (/^\d{0,10}$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
      return;
    }

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setStatus("");

  if (!validate()) return;

  setLoading(true);

  try {
    // Format the date for the API (YYYY-MM-DD)
    const formattedDate = formData.fromDate 
      ? new Date(formData.fromDate).toISOString().split('T')[0]
      : '';

    const payload = {
      ...formData,
      slotBookingDate: formattedDate, // Only use fromDate for the slot
      // Remove the temporary date range fields
      fromDate: undefined,
      toDate: undefined
    };

    // Remove undefined values
    const cleanPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, v]) => v !== undefined)
    );

    const res = await fetch("/api/MoreLinks/InsertSlotBooking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleanPayload),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      setStatus("✅ Your slot has been booked successfully!");
      // Reset form
      setFormData({
        fullName: "",
        mobileNo: "",
        email: "",
        location: "",
        fromDate: "",
        toDate: "",
        slotBookingDate: "",
        slotBookingTime: "",
        message: "",
      });
    } else {
      setStatus(`❌ ${data.message || "Booking failed. Please try again."}`);
    }
  } catch (error) {
    console.error("API Error:", error);
    setStatus("❌ Something went wrong. Please try again later.");
  } finally {
    setLoading(false);
  }
};
  return (
    <>
      <Navbar />
      <div className="flex justify-start items-start min-h-screen bg-gray-100 px-20 py-16">
        <div className="bg-white shadow-lg rounded-2xl p-16 max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 mt-20">
          {/* Left Section */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Slot Booking</h1>
            <p className="text-gray-600 mt-4 leading-relaxed">
              Book your slot easily by filling out the details below. Our team will get back to you shortly.
            </p>
          </div>

          {/* Right Section (Form) */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              {/* Full Name */}
              <div>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name *"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`custom-input ${errors.fullName ? "border-red-500" : ""}`}
                />
                {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
              </div>

              {/* Mobile */}
              <div>
                <input
                  type="tel"
                  name="mobileNo"
                  placeholder="Phone number *"
                  value={formData.mobileNo}
                  onChange={handleChange}
                  inputMode="numeric"
                  maxLength="10"
                  className={`custom-input ${errors.mobileNo ? "border-red-500" : ""}`}
                />
                {errors.mobileNo && <p className="text-red-500 text-sm">{errors.mobileNo}</p>}
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`custom-input ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              {/* Location */}
              <div>
                <input
                  type="text"
                  name="location"
                  placeholder="Location *"
                  value={formData.location}
                  onChange={handleChange}
                  className={`custom-input ${errors.location ? "border-red-500" : ""}`}
                />
                {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
              </div>
{/* Date Range */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* From Date */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
    <input
      type="date"
      name="fromDate"
      value={formData.fromDate || ''}
      onChange={handleChange}
      min={new Date().toISOString().split('T')[0]}
      className={`custom-input w-full ${
        errors.fromDate ? "border-red-500" : ""
      }`}
    />
    {errors.fromDate && (
      <p className="text-red-500 text-xs mt-1">{errors.fromDate}</p>
    )}
  </div>

  {/* To Date */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
    <input
      type="date"
      name="toDate"
      value={formData.toDate || ''}
      onChange={handleChange}
      min={formData.fromDate || new Date().toISOString().split('T')[0]}
      max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
      disabled={!formData.fromDate}
      className={`custom-input w-full ${
        errors.toDate ? "border-red-500" : ""
      } ${!formData.fromDate ? "bg-gray-100" : ""}`}
    />
    {errors.toDate ? (
      <p className="text-red-500 text-xs mt-1">{errors.toDate}</p>
    ) : (
      <p className="text-gray-500 text-xs mt-1">
        {formData.fromDate && formData.toDate 
          ? `Selected: ${new Date(formData.fromDate).toLocaleDateString()} to ${new Date(formData.toDate).toLocaleDateString()}`
          : "Select a date range (max 30 days)"
        }
      </p>
    )}
  </div>
</div>
              {/* Time */}
              <div>
                <input
                  type="time"
                  name="slotBookingTime"
                  value={formData.slotBookingTime}
                  onChange={handleChange}
                  className={`custom-input ${errors.slotBookingTime ? "border-red-500" : ""}`}
                />
                {errors.slotBookingTime && <p className="text-red-500 text-sm">{errors.slotBookingTime}</p>}
              </div>

              {/* Message */}
              <div>
                <textarea
                  name="message"
                  placeholder="Message *"
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  className={`custom-input h-28 ${errors.message ? "border-red-500" : ""}`}
                />
                {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-white font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg hover:opacity-90 transition"
            >
              {loading ? "Sending..." : "SEND"}
            </button>

            {/* Status */}
            {status && (
              <p
                className={`text-sm mt-3 ${
                  status.startsWith("✅")
                    ? "text-green-600"
                    : status.startsWith("⚠️")
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {status}
              </p>
            )}
          </form>
        </div>

        <style jsx>{`
          .custom-input {
            width: 100%;
            padding: 12px 16px;
            border-radius: 20px;
            border: 1px solid #ccc;
            background: white;
            font-size: 16px;
            outline: none;
            transition: border 0.3s;
          }
          .custom-input:focus {
            border-color: #7d56f3;
          }
        `}</style>
      </div>
      <Footer />
    </>
  );
}
