"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ArrowLeft, CreditCard, Landmark, Wallet, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PaymentSelect() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePaymentClick = (path) => {
    // Show success popup
    setShowSuccess(true);
    
    // Optional: Redirect after delay
    setTimeout(() => {
      router.push("EventBooking");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      <div className="flex-1 p-4 mt-20">
        <div className="max-w-md mx-auto bg-[#111] p-6 rounded-2xl shadow-lg relative">
          {/* Success Popup */}
          {showSuccess && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-2xl z-10">
              <div className="bg-[#1e1e1e] p-6 rounded-xl text-center max-w-xs">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
                <p className="text-gray-300 mb-4">Redirecting to payment page...</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center text-white hover:text-gray-300"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              <span>Back</span>
            </button>
            <h2 className="text-xl font-semibold">Select Payment Method</h2>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handlePaymentClick("/payment/card")}
              className="w-full flex justify-between items-center bg-[#1e1e1e] hover:bg-[#2a2a2a] border border-gray-700 p-4 rounded-xl transition-colors"
            >
              <span>Debit / Credit Card</span>
              <CreditCard className="w-5 h-5" />
            </button>

            <button
              onClick={() => handlePaymentClick("/payment/netbanking")}
              className="w-full flex justify-between items-center bg-[#1e1e1e] hover:bg-[#2a2a2a] border border-gray-700 p-4 rounded-xl transition-colors"
            >
              <span>Net Banking</span>
              <Landmark className="w-5 h-5" />
            </button>

            <button
              onClick={() => handlePaymentClick("/payment/upi")}
              className="w-full flex justify-between items-center bg-[#1e1e1e] hover:bg-[#2a2a2a] border border-gray-700 p-4 rounded-xl transition-colors"
            >
              <span>UPI</span>
              <Wallet className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}