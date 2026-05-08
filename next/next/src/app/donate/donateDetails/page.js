"use client";
import { useState } from "react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function DonateDetails() {
  const [amount, setAmount] = useState(2000);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', { amount, ...formData });
  };

  return (
    <div className="min-h-screen flex flex-col bg-grey-to-b from-zinc-900 to-black">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center px-6 py-[128px]">
        <form onSubmit={handleSubmit} className="w-full max-w-lg bg-zinc-900/90 rounded-2xl shadow-2xl p-8 text-white">
          {/* Header */}
          <h2 className="text-xl font-semibold mb-6">Donate</h2>

          {/* Selected Amount */}
          <div className="bg-zinc-800 rounded-xl p-4 mb-6">
            <p className="text-sm text-zinc-400">Selected Amount</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-lg font-bold">₹ {amount}/-</p>
              <button
                type="button"
                onClick={() => setAmount(prev => prev + 1000)}
                className="text-rose-400 hover:text-rose-500"
              >
                ✎
              </button>
            </div>
          </div>

          {/* Contributor Details */}
          <div className="bg-zinc-800 rounded-xl p-6">
            <h3 className="text-base font-medium mb-4">Contributor Details</h3>

            {/* Full Name */}
            <label className="block text-sm text-zinc-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full p-3 mb-4 rounded-md border border-gray-400 bg-[rgb(231_37_97_/12%)] text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
              required
            />

            {/* Mobile Number */}
            <label className="block text-sm text-zinc-300 mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter mobile number"
              className="w-full p-3 mb-4 rounded-md border border-gray-400 bg-[rgb(231_37_97_/12%)] text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
              required
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit mobile number"
            />

            {/* Message */}
            <label className="block text-sm text-zinc-300 mb-1">
              Message (Optional)
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter comments"
              rows={4}
              className="w-full p-3 rounded-md border border-gray-400 bg-[rgb(231_37_97_/12%)] text-white placeholder-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-6">
            <button 
              type="button" 
              className="text-sm text-zinc-400 hover:text-zinc-200"
              onClick={() => {
                // Handle skip & pay logic
                handleSubmit({ preventDefault: () => {} });
              }}
            >
              Skip & Pay
            </button>

            <button 
              type="submit" 
              className="bg-rose-500 hover:bg-rose-600 transition px-6 py-3 rounded-lg font-semibold"
            >
              Proceed to Pay
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}