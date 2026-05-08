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
    fromDate: "",
    toDate: "",
    slotBookingDate: "",
    slotBookingTime: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  
  // Time slots data
  const timeSlots = {
    prime: [
      "07:00", "07:30", "08:00", "08:30",
      "09:00", "09:30", "10:00", "10:30",
      "11:00", "11:30", "12:00", "12:30"
    ],
    nonPrime: [
      "13:00", "13:30", "14:00", "14:30",
      "15:00", "15:30", "16:00", "16:30",
      "17:00", "17:30", "18:00", "18:30"
    ]
  };
  
  // Time picker state
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timeType, setTimeType] = useState("prime");
  const [tempSelectedSlot, setTempSelectedSlot] = useState("");
  
  // Open time picker
  const openTimePicker = () => {
    setTempSelectedSlot(formData.slotBookingTime || "");
    setShowTimePicker(true);
  };
  
  // Handle time slot selection
  const handleTimeSelect = (time) => {
    setTempSelectedSlot(time);
  };
  
  // Toggle between prime and non-prime time
  const toggleTimeType = (type) => {
    setTimeType(type);
  };
  
  // Apply time selection
  const applyTimeSelection = () => {
    setFormData({ ...formData, slotBookingTime: tempSelectedSlot });
    setErrors({ ...errors, slotBookingTime: "" });
    setShowTimePicker(false);
  };
  
  // Cancel time selection
  const cancelTimeSelection = () => {
    setShowTimePicker(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobileNo" && !/^\d{0,10}$/.test(value)) return;

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};

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

    if (!formData.fromDate) {
      newErrors.fromDate = "Please select a start date";
    }

    if (!formData.slotBookingTime) {
      newErrors.slotBookingTime = "Please select a time";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    if (!validate()) return;

    setLoading(true);

    try {
      const formattedDate = formData.fromDate 
        ? new Date(formData.fromDate).toISOString().split('T')[0]
        : '';

      const payload = {
        ...formData,
        slotBookingDate: formattedDate,
        fromDate: undefined,
        toDate: undefined
      };

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

  const inputStyle = {
    width: "100%",
    height: "50px",
    padding: "12px 20px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    backgroundColor: "#fff",
    fontSize: "15px",
    outline: "none",
    fontFamily: "Fustat, sans-serif",
    transition: "border-color 0.2s",
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: "120px",
    resize: "vertical",
    padding: "14px 20px",
  };
  return (
    <>
      <Navbar />

      <div
        className="min-h-screen flex justify-center items-start mt-10"
        style={{ background: "#f3f4f6", padding: "96px 24px" }}
      >
        <div
          className="w-full max-w-6xl bg-white rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2"
          style={{ padding: "64px", gap: "64px" }}
        >
          {/* LEFT CONTENT */}
          <div>
            <h1
              className="font-bold text-gray-900"
              style={{
                fontFamily: 'Fustat, sans-serif',
                fontWeight: 700,
                fontStyle: 'bold',
                fontSize: '40px',
                lineHeight: '100%',
                letterSpacing: '0%',
                marginBottom: '16px'
              }}
            >
              Slot Booking
            </h1>
            <p
              className="text-gray-600"
              style={{
                fontFamily: 'Fustat, sans-serif',
                fontWeight: 300,
                fontStyle: 'normal',
                fontSize: '18px',
                lineHeight: '150%',
                letterSpacing: '0%',
                margin: 0
              }}
            >
              Book your slot easily by filling out the details below. Our team will get back to you shortly.
            </p>
          </div>

          {/* RIGHT FORM */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <input
              name="fullName"
              placeholder="Full Name *"
              value={formData.fullName}
              onChange={handleChange}
              style={{ 
                ...inputStyle, 
                borderColor: errors.fullName ? "#EF4444" : "#d1d5db"
              }}
            />
            {errors.fullName && <p style={{ color: "#EF4444", fontSize: "14px", marginTop: "-8px" }}>{errors.fullName}</p>}

            <input
              name="mobileNo"
              type="tel"
              placeholder="Phone number *"
              value={formData.mobileNo}
              onChange={handleChange}
              maxLength={10}
              style={{ 
                ...inputStyle, 
                borderColor: errors.mobileNo ? "#EF4444" : "#d1d5db" 
              }}
            />
            {errors.mobileNo && <p style={{ color: "#EF4444", fontSize: "14px", marginTop: "-8px" }}>{errors.mobileNo}</p>}

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              style={{ 
                ...inputStyle, 
                borderColor: errors.email ? "#EF4444" : "#d1d5db" 
              }}
            />
            {errors.email && <p style={{ color: "#EF4444", fontSize: "14px", marginTop: "-8px" }}>{errors.email}</p>}

            <input
              name="location"
              placeholder="Location *"
              value={formData.location}
              onChange={handleChange}
              style={{ 
                ...inputStyle, 
                borderColor: errors.location ? "#EF4444" : "#d1d5db" 
              }}
            />
            {errors.location && <p style={{ color: "#EF4444", fontSize: "14px", marginTop: "-8px" }}>{errors.location}</p>}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#4B5563" }}>From Date *</label>
                <input
                  type="date"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  style={{ 
                    ...inputStyle,
                    borderColor: errors.fromDate ? "#EF4444" : "#d1d5db"
                  }}
                />
                {errors.fromDate && <p style={{ color: "#EF4444", fontSize: "14px", marginTop: "4px" }}>{errors.fromDate}</p>}
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#4B5563" }}>To Date</label>
                <input
                  type="date"
                  name="toDate"
                  value={formData.toDate}
                  onChange={handleChange}
                  min={formData.fromDate || new Date().toISOString().split('T')[0]}
                  max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  disabled={!formData.fromDate}
                  style={{ 
                    ...inputStyle,
                    borderColor: errors.toDate ? "#EF4444" : "#d1d5db",
                    backgroundColor: !formData.fromDate ? "#f9fafb" : "#fff"
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#4B5563" }}>Time Slot *</label>
              
              {/* Time Slot Input */}
              <div
                onClick={openTimePicker}
                style={{
                  ...inputStyle,
                  cursor: 'pointer',
                  backgroundColor: formData.slotBookingTime ? '#fff' : '#f9fafb',
                  borderColor: errors.slotBookingTime ? '#EF4444' : '#d1d5db',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingRight: '40px',
                  color: formData.slotBookingTime ? '#111827' : '#9CA3AF'
                }}
              >
                {formData.slotBookingTime || 'Select time slot'}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6B7280'
                  }}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              
              {errors.slotBookingTime && (
                <p style={{ color: "#EF4444", fontSize: "14px", marginTop: "4px" }}>
                  {errors.slotBookingTime}
                </p>
              )}
              
              {/* Time Picker Modal */}
              {showTimePicker && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
                  padding: '20px'
                }}>
                  <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    width: '100%',
                    maxWidth: '500px',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}>
                    <div style={{
                      padding: '20px',
                      borderBottom: '1px solid #E5E7EB'
                    }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#111827',
                        margin: 0
                      }}>
                        Select Time Slot
                      </h3>
                    </div>
                    
                    {/* Time Type Toggle */}
                    <div style={{ 
                      display: 'flex', 
                      margin: '16px 20px',
                      backgroundColor: '#F3F4F6',
                      borderRadius: '8px',
                      padding: '4px',
                      width: 'fit-content'
                    }}>
                      {['prime', 'nonPrime'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => toggleTimeType(type)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '6px',
                            border: 'none',
                            background: timeType === type ? '#4F46E5' : 'transparent',
                            color: timeType === type ? 'white' : '#6B7280',
                            fontWeight: 500,
                            fontSize: '14px',
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {type === 'prime' ? 'Prime Time' : 'Non Prime Time'}
                        </button>
                      ))}
                    </div>
                    
                    {/* Time Slots Grid */}
                    <div style={{
                      padding: '0 20px',
                      overflowY: 'auto',
                      maxHeight: '300px',
                      marginBottom: '20px'
                    }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '12px',
                        padding: '4px'
                      }}>
                        {timeSlots[timeType].map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => handleTimeSelect(time)}
                            style={{
                              ...inputStyle,
                              padding: '10px',
                              textAlign: 'center',
                              borderColor: tempSelectedSlot === time ? '#4F46E5' : '#d1d5db',
                              backgroundColor: tempSelectedSlot === time ? '#EEF2FF' : 'white',
                              color: tempSelectedSlot === time ? '#4F46E5' : '#374151',
                              fontWeight: tempSelectedSlot === time ? 600 : 400,
                              cursor: 'pointer',
                              position: 'relative',
                              transition: 'all 0.2s',
                              height: 'auto',
                              ':hover': {
                                borderColor: '#4F46E5',
                                background: '#EEF2FF'
                              }
                            }}
                          >
                            {time}
                            {tempSelectedSlot === time && (
                              <div style={{
                                position: 'absolute',
                                top: '-6px',
                                right: '-6px',
                                width: '20px',
                                height: '20px',
                                backgroundColor: '#4F46E5',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: 'bold'
                              }}>
                                ✓
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: '12px',
                      padding: '16px 20px',
                      borderTop: '1px solid #E5E7EB',
                      backgroundColor: '#F9FAFB',
                      borderBottomLeftRadius: '12px',
                      borderBottomRightRadius: '12px'
                    }}>
                      <button
                        type="button"
                        onClick={cancelTimeSelection}
                        style={{
                          padding: '10px 20px',
                          borderRadius: '8px',
                          border: '1px solid #D1D5DB',
                          background: 'white',
                          color: '#374151',
                          fontWeight: 500,
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          ':hover': {
                            background: '#F3F4F6'
                          }
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={applyTimeSelection}
                        disabled={!tempSelectedSlot}
                        style={{
                          padding: '10px 20px',
                          borderRadius: '8px',
                          border: 'none',
                          background: tempSelectedSlot ? '#EF4444' : '#9CA3AF',
                          color: 'white',
                          fontWeight: 500,
                          fontSize: '14px',
                          cursor: tempSelectedSlot ? 'pointer' : 'not-allowed',
                          transition: 'all 0.2s',
                          ':hover': {
                            background: tempSelectedSlot ? '#DC2626' : '#9CA3AF'
                          }
                        }}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#4B5563" }}>Message *</label>
              <textarea
                name="message"
                placeholder="Your message..."
                rows={4}
                value={formData.message}
                onChange={handleChange}
                style={{ 
                  ...textareaStyle, 
                  borderColor: errors.message ? "#EF4444" : "#d1d5db" 
                }}
              />
              {errors.message && <p style={{ color: "#EF4444", fontSize: "14px", marginTop: "4px" }}>{errors.message}</p>}
            </div>

            {status && (
              <p
                style={{
                  color: status.startsWith("✅") ? "#10B981" : "#EF4444",
                  fontSize: "14px",
                  margin: "8px 0 0",
                  textAlign: "center"
                }}
              >
                {status}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "16px",
                padding: "14px",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "16px",
                fontWeight: "600",
                background: "linear-gradient(90deg, #9C7CF4, #A43E4C)",
                border: "none",
                cursor: "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "opacity 0.2s",
                height: "50px",
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = "0.9"}
              onMouseOut={(e) => e.currentTarget.style.opacity = loading ? "0.7" : "1"}
            >
              {loading ? "Sending..." : "BOOK SLOT"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}
