import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section */}
      <div className="md:w-1/2 w-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center p-6">
        <img
          src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80"
          alt="signup"
          className="rounded-lg w-full h-[400px] md:h-[90%] object-cover opacity-80"
        />
      </div>

      {/* Right Section */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
