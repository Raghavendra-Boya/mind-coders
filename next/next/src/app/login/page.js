"use client"; // ✅ THIS IS REQUIRED
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  setLoginFormData,
  loginUser,
  resetLoginForm
} from "../../store/slices/authSlice";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  // Get state from Redux store
  const { loginFormData, loginLoading, loginStatus } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    dispatch(setLoginFormData({ [e.target.name]: e.target.value }));
  };

  const handleLoginClick = () => {
    router.push("/dashboard"); // navigate to full login page
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // For now, keep the simple validation for admin/1234
    if (loginFormData.username === "admin" && loginFormData.password === "1234") {
      router.push("/dashboard");
    } else {
      // Use Redux for API-based login
      const result = await dispatch(loginUser({
        userName: loginFormData.username,
        source: 0,
      }));

      if (loginUser.fulfilled.match(result)) {
        router.push("/dashboard");
      }
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8] px-4">
      <div className="flex flex-col items-center justify-center">
        {/* Logo */}
        <div
          className=""
          style={{
            top: '121px',
            left: '662px'
          }}
        >
          <img
            src="/asset/Rakshana Logo.svg"
            alt="Rakshana TV Logo"
            style={{
              width: '188px',
              height: '123px',
              opacity: 1
            }}
            className="mb-4"
          />
        </div>

        {/* Login Card */}
        <div
          className="bg-white rounded-xl shadow-md text-center mx-auto"
          style={{
            width: '480px',
            minHeight: '433px',
            borderRadius: '20px',
            padding: '50px',
            boxSizing: 'border-box',
            margin: '0 auto',
            opacity: 1
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '50px',
            height: '100%'
          }}>
            <div>
              <h2
                style={{
                  fontFamily: 'Fustat, sans-serif',
                  fontWeight: 700,
                  fontSize: '28px',
                  lineHeight: '100%',
                  letterSpacing: '0px',
                  color: '#1F2937',
                  marginBottom: '4px',
                  textAlign: 'left'
                }}
              >
                Login to your account.
              </h2>
              <p
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '100%',
                  color: '#4B5563',
                  letterSpacing: '0%',
                  marginTop: '10px',
                  textAlign: 'left',
                  width: '100%',
                  padding: 0,
                  marginLeft: 0
                }}
              >
                Use email ID to login
              </p>
            </div>

            <form onSubmit={handleSubmit} className="text-left" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="text"
                  name="username"
                  value={loginFormData.username}
                  onChange={handleChange}
                  placeholder="Username or Email ID"
                  style={{
                    width: '380px',
                    height: '50px',
                    borderRadius: '6px',
                    padding: '15px 12px',
                    border: '1px solid #D1D5DB',
                    fontFamily: 'Fustat, sans-serif',
                    fontSize: '14px',
                    lineHeight: '120%',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Password Field */}
              <div style={{ marginBottom: '10px', position: 'relative' }}>

                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={loginFormData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    style={{
                      width: '380px',
                      height: '50px',
                      borderRadius: '6px',
                      padding: '15px 40px 15px 12px',
                      border: '1px solid #D1D5DB',
                      fontFamily: 'Fustat, sans-serif',
                      fontSize: '14px',
                      lineHeight: '120%',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="mb-6" style={{ textAlign: 'right' }}>
                <button
                  type="button"
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 600,
                    fontSize: '14px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: '#E11D48',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px 0',
                    textAlign: 'right',
                    width: '100%'
                  }}
                >
                  Forgot Password?
                </button>
              </div>

              {loginStatus && (
                <p
                  className={`text-center mb-4 ${loginStatus.includes("successful") ? "text-green-600" : "text-red-600"
                    }`}
                  style={{
                    fontFamily: 'Fustat, sans-serif',
                    fontSize: '14px',
                    lineHeight: '120%'
                  }}
                >
                  {loginStatus}
                </p>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                style={{
                  width: '380px',
                  height: '50px',
                  backgroundColor: '#EC5C54',
                  color: 'white',
                  padding: '15px 10px',
                  borderRadius: '6px',
                  border: '1px solid #EC5C54',
                  fontFamily: 'Fustat, sans-serif',
                  fontWeight: 600,
                  fontSize: '16px',
                  lineHeight: '120%',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  opacity: 1
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                onClick={handleLoginClick}
              >
                {loginLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '100%',
                letterSpacing: '0%',
                color: '#374151',
                textAlign: 'center',
              }}
            >
              Don't have an account?{" "}
              <button
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#E11D48',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '14px',
                  lineHeight: '100%',
                  fontWeight: 500,
                  cursor: 'pointer',
                  padding: 0,
                  letterSpacing: '0%'
                }}
              >
                Contact Admin
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
