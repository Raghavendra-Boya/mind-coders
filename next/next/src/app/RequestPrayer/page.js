"use client";
import { useDispatch, useSelector } from "react-redux";
import { setFormData, setErrors, submitPrayerRequest } from "../../store/slices/requestPrayerSlice";
import Navbar from "@/components/Navbar";
import DownloadApp from "../download/page";
import Footer from "@/components/Footer";

export default function RequestPrayer() {
  const dispatch = useDispatch();
  const { formData, errors, loading, status } = useSelector((state) => state.requestPrayer);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Please enter your full name.";
    else if (!/^[A-Za-z\s]+$/.test(formData.fullName.trim())) newErrors.fullName = "Full name should contain only letters.";

    if (!formData.mobileNo.trim()) newErrors.mobileNo = "Please enter your phone number.";
    else if (!/^\d{10}$/.test(formData.mobileNo.trim())) newErrors.mobileNo = "Phone number must be exactly 10 digits.";

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Please enter a valid email address.";

    if (!formData.location.trim()) newErrors.location = "Please enter your location.";
    if (!formData.message.trim()) newErrors.message = "Please enter your message.";

    dispatch(setErrors(newErrors));
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobileNo" && !/^\d{0,10}$/.test(value)) return;
    dispatch(setFormData({ [name]: value }));
    if (errors[name]) dispatch(setErrors({ ...errors, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await dispatch(submitPrayerRequest(formData));
    console.log("Submit result:", result);
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 px-6 py-16 flex justify-center">
        <div className="bg-white shadow-lg rounded-2xl p-16 max-w-[1200px] w-full grid grid-cols-1 md:grid-cols-2 gap-12 mt-20">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-[40px] font-bold text-gray-900 leading-none tracking-normal" style={{ fontFamily: 'Fustat, sans-serif', fontStyle: 'normal' }}>Prayer Request</h1>
            <p className="text-gray-600 mt-6 text-lg" style={{
              fontFamily: 'Fustat, sans-serif',
              fontWeight: 300,
              fontStyle: 'normal',
              lineHeight: '150%',
              letterSpacing: '0%',
              fontSize: '18px'
            }}>
              Fill out the form below to send your prayer request. Our team will keep you in our prayers.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <input 
                type="text" 
                name="fullName" 
                placeholder="Full Name *" 
                value={formData.fullName} 
                onChange={handleChange} 
                className={`w-full h-[50px] px-5 py-3 rounded-lg border ${errors.fullName ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 outline-none shadow-sm`} 
                style={{
                  fontFamily: 'Fustat, sans-serif',
                  fontWeight: 300,
                  fontSize: '16px',
                  lineHeight: '150%',
                  letterSpacing: '0%',
                  opacity: 1
                }}
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>

            <div className="space-y-2">
              <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                value={formData.email} 
                onChange={handleChange} 
                className={`w-full h-[50px] px-5 py-3 rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 outline-none shadow-sm`} 
                style={{
                  fontFamily: 'Fustat, sans-serif',
                  fontWeight: 300,
                  fontSize: '16px',
                  lineHeight: '150%',
                  letterSpacing: '0%',
                  opacity: 1
                }}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <input 
                type="tel" 
                name="mobileNo" 
                placeholder="Phone Number *" 
                value={formData.mobileNo} 
                onChange={handleChange} 
                maxLength="10" 
                inputMode="numeric" 
                className={`w-full h-[50px] px-5 py-3 rounded-lg border ${errors.mobileNo ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 outline-none shadow-sm`} 
                style={{
                  fontFamily: 'Fustat, sans-serif',
                  fontWeight: 300,
                  fontSize: '16px',
                  lineHeight: '150%',
                  letterSpacing: '0%',
                  opacity: 1
                }}
              />
              {errors.mobileNo && <p className="text-red-500 text-sm mt-1">{errors.mobileNo}</p>}
            </div>

            <div className="space-y-2">
              <input 
                type="text" 
                name="location" 
                placeholder="Location *" 
                value={formData.location} 
                onChange={handleChange} 
                className={`w-full h-[50px] px-5 py-3 rounded-lg border ${errors.location ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 outline-none shadow-sm`} 
                style={{
                  fontFamily: 'Fustat, sans-serif',
                  fontWeight: 300,
                  fontSize: '16px',
                  lineHeight: '150%',
                  letterSpacing: '0%',
                  opacity: 1
                }}
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>

            <textarea name="message" placeholder="Message *" rows={4} value={formData.message} onChange={handleChange} className={`w-full px-5 py-4 rounded-[20px] border ${errors.message ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 outline-none shadow-sm`} />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}

            <button type="submit" disabled={loading} className="w-full py-3 text-white font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg hover:opacity-90 transition">
              {loading ? "Sending..." : "SEND"}
            </button>

            {status && <p className={`text-sm mt-3 ${status.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>{status}</p>}
          </form>
        </div>
      </div>
      <DownloadApp />
      <Footer />
    </>
  );
}
