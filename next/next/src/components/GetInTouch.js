"use client";

import { MapPin, Mail, Phone } from "lucide-react";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setContactFormData, submitContactForm } from "@/store/slices/ContactSlice";
import { useEffect } from "react";

export default function ContactForm() {
  const dispatch = useDispatch();
  const { formData, submitting, status } = useSelector((state) => state.contact);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitContactForm(formData));
  };

  return (
    <div className="max-w-5xl mx-auto">
      <Navbar />

      {/* Get In Touch Section */}
      <div className="text-center my-10 mt-[200px]">
        <h1
          className="text-gray-900"
          style={{
            width: '880px',
            height: '96px',
            opacity: 1,
            fontFamily: 'Fustat',
            fontWeight: 800,
            fontStyle: 'normal',
            fontSize: '74px',
            lineHeight: '130%',
            letterSpacing: '0px',
            textAlign: 'center',
            textTransform: 'capitalize',
            margin: '0 auto',
            maxWidth: '100%',
            height: 'auto'
          }}
        >
          Get In Touch
        </h1>
        <p
          className="text-gray-600 mt-2"
          style={{
            width: '880px',
            height: '54px',
            opacity: 1,
            fontFamily: 'Fustat',
            fontWeight: 300,
            fontStyle: 'normal',
            fontSize: '18px',
            lineHeight: '150%',
            letterSpacing: '0%',
            textAlign: 'center',
            margin: '16px auto 0',
            maxWidth: '100%',
            height: 'auto'
          }}
        >
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.
          Amet minim mollit non deserunt ullamco.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg flex flex-col md:flex-row" style={{
        width: '1200px',
        maxWidth: '100%',
        height: 'auto',
        margin: '0 auto',
        opacity: 1,
        gap: '30px',
        borderRadius: '20px',
        padding: '60px',
        background: '#FFFFFF',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Form Section */}
        <div style={{
          width: '515px',
          height: '527px',
          display: 'flex',
          flexDirection: 'column',
          gap: '30px',
          margin: '0 auto'
        }}>
          <h2
            style={{
              fontFamily: 'Fustat',
              fontWeight: 700,
              fontStyle: 'normal',
              fontSize: '40px',
              lineHeight: '100%',
              letterSpacing: '0%',
              width: '250px',
              height: '57px',
              opacity: 1,
              marginBottom: '24px',
              color: '#1F2937'
            }}
          >
            Let's Connect
          </h2>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            {/* Name */}
            <div style={{ marginBottom: '16px' }}>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => dispatch(setContactFormData({ name: e.target.value }))}
                placeholder="Name *"
                required
                style={{
                  width: '100%',
                  height: '50px',
                  borderRadius: '8px',
                  border: '1px solid #BBBBBB',
                  padding: '12px 20px',
                  fontFamily: 'Fustat, sans-serif',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '24px',
                  letterSpacing: '1%',
                  color: '#000',
                  outline: 'none',
                  marginBottom: '4px'
                }}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => dispatch(setContactFormData({ email: e.target.value }))}
                required
                style={{
                  width: '100%',
                  height: '50px',
                  borderRadius: '8px',
                  border: '1px solid #BBBBBB',
                  padding: '12px 20px',
                  fontFamily: 'Fustat, sans-serif',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '24px',
                  letterSpacing: '1%',
                  color: '#000',
                  outline: 'none',
                  marginBottom: '4px'
                }}
              />
            </div>

            {/* Phone */}
            <div style={{ marginBottom: '16px' }}>
              <input
                type="tel"
                value={formData.phoneNumber}
                placeholder="Phone Number *"
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  dispatch(setContactFormData({ phoneNumber: value }));
                }}
                required
                style={{
                  width: '100%',
                  height: '50px',
                  borderRadius: '8px',
                  border: '1px solid #BBBBBB',
                  padding: '12px 20px',
                  fontFamily: 'Fustat, sans-serif',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '24px',
                  letterSpacing: '1%',
                  color: '#000',
                  outline: 'none',
                  marginBottom: '4px'
                }}
              />

            </div>

            {/* How did you find us? - Optional */}
            <div style={{ marginBottom: '16px' }}>
              <select
                value={formData.referralSource || ''}
                onChange={(e) => dispatch(setContactFormData({ referralSource: e.target.value }))}
                style={{
                  width: '100%',
                  height: '50px',
                  borderRadius: '8px',
                  border: '1px solid #BBBBBB',
                  padding: '0 20px',
                  fontFamily: 'Fustat, sans-serif',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '24px',
                  letterSpacing: '1%',
                  color: formData.referralSource ? '#000' : '#9CA3AF',
                  WebkitAppearance: 'none',
                  backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23555555'%3E%3Cpath d='M7.41 8.59L12 4l1.41 1.41L7.41 11 3 6.59 4.41 5z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 16px center',
                  backgroundSize: '16px 12px',
                  paddingRight: '40px',
                  outline: 'none',
                  marginBottom: '4px'
                }}
              >
                <option value="" disabled hidden>How did you find us? (Optional)</option>
                <option value="search_engine">Search Engine (Google, Bing, etc.)</option>
                <option value="social_media">Social Media</option>
                <option value="friend">Friend or Family</option>
                <option value="event">Event or Conference</option>
                <option value="advertisement">Advertisement</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Message */}
            <div style={{ marginBottom: '24px' }}>
              <textarea
                value={formData.message}
                onChange={(e) => dispatch(setContactFormData({ message: e.target.value }))}
                placeholder="Your message here..."
                rows="4"
                required
                style={{
                  width: '100%',
                  minHeight: '120px',
                  borderRadius: '8px',
                  border: '1px solid #BBBBBB',
                  padding: '12px 20px',
                  fontFamily: 'Fustat, sans-serif',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '24px',
                  letterSpacing: '1%',
                  color: '#000',
                  outline: 'none',
                  resize: 'vertical',
                  marginBottom: '4px'
                }}
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                height: '50px',
                borderRadius: '8px',
                background: 'linear-gradient(90deg, #A184F6 0%, #AA4249 100%)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 600,
                opacity: submitting ? 0.7 : 1,
                transition: 'opacity 0.3s ease',
                fontFamily: 'Fustat, sans-serif',
                marginBottom: '16px'
              }}
            >
              {submitting ? 'Sending...' : 'SEND MESSAGE'}
            </button>

            {status && <p className="text-center mt-2 text-green-600 font-medium" style={{ marginTop: '16px' }}>{status}</p>}
          </form>
        </div>

        {/* Map Section */}
        <div style={{
          width: '515px',
          height: '540px',
          opacity: 1,
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.393037499174!2d106.82564071477427!3d-6.274628495462631!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e4f4a7aebf%3A0x2b0c7196b2d8eb4b!2sJakarta%2C%20Indonesia!5e0!3m2!1sen!2sid!4v1648245944591!5m2!1sen!2sid"
            allowFullScreen
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              border: 0,
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          ></iframe>
        </div>
      </div>

      {/* Contact Info Section */}
<div
  className="bg-white p-6 md:p-10 my-24 rounded-lg shadow-lg flex flex-col md:flex-row flex-wrap justify-center items-stretch"
  style={{
    width: '100%',
    maxWidth: '1200px',
    opacity: 1,
    borderRadius: '20px',
    border: '1px solid #E5E7EB',
    margin: '6rem auto',
    gap: '20px'
  }}
>
  {/* Address Section */}
  <div className="w-full md:w-[calc(33.333%-14px)] flex-shrink-0">
    <div style={{
      width: '100%',
      minHeight: '294px',
      opacity: 1,
      padding: '30px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '18px'
    }}>
      <div style={{ 
        width: '80px', 
        height: '80px', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img
          src="/asset/location.png"
          alt="Location"
          style={{
            width: '40px',
            height: '40px',
            opacity: 1
          }}
        />
      </div>
      <h3 style={{
        width: '100%',
        height: '37px',
        opacity: 1,
        fontFamily: 'Fustat',
        fontWeight: 700,
        fontSize: '26px',
        lineHeight: '100%',
        letterSpacing: '0%',
        textAlign: 'center',
        margin: 0
      }}>Address</h3>
      <p style={{
        fontFamily: 'Fustat',
        fontWeight: 500,
        fontSize: '18px',
        lineHeight: '150%',
        letterSpacing: '0%',
        textAlign: 'center',
        width: '100%',
        minHeight: '104px',
        opacity: 1,
        color: '#6B7280',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        Sonic Visions Rakshana TV Trust, 1-1-568/1, Chennu Avenue 405, Golconda X Roads Hyderabad - 500020, India.
      </p>
    </div>
  </div>

  {/* Email Section */}
  <div className="w-full md:w-[calc(33.333%-14px)] flex-shrink-0">
    <div style={{
      width: '100%',
      minHeight: '294px',
      opacity: 1,
      padding: '30px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '18px'
    }}>
      <div style={{ 
        width: '80px', 
        height: '80px', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img
          src="/asset/email.svg"
          alt="Email"
          style={{
            width: '50px',
            height: '50px',
            opacity: 1
          }}
        />
      </div>
      <h3 style={{
        width: '100%',
        height: '37px',
        opacity: 1,
        fontFamily: 'Fustat',
        fontWeight: 700,
        fontSize: '26px',
        lineHeight: '100%',
        letterSpacing: '0%',
        textAlign: 'center',
        margin: 0
      }}>Email</h3>
      <p style={{
        fontFamily: 'Fustat',
        fontWeight: 500,
        fontSize: '18px',
        lineHeight: '150%',
        letterSpacing: '0%',
        textAlign: 'center',
        width: '100%',
        minHeight: '26px',
        opacity: 1,
        color: '#6B7280',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        rakshana.tv@gmail.com
      </p>
    </div>
  </div>

  {/* Phone Section */}
  <div className="w-full md:w-[calc(33.333%-14px)] flex-shrink-0">
    <div style={{
      width: '100%',
      minHeight: '294px',
      opacity: 1,
      padding: '30px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '18px'
    }}>
      <div style={{ 
        width: '80px', 
        height: '80px', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img
          src="/asset/phone.svg"
          alt="Phone"
          style={{
            width: '50px',
            height: '50px',
            opacity: 1
          }}
        />
      </div>
      <h3 style={{
        width: '100%',
        height: '37px',
        opacity: 1,
        fontFamily: 'Fustat',
        fontWeight: 700,
        fontSize: '26px',
        lineHeight: '100%',
        letterSpacing: '0%',
        textAlign: 'center',
        margin: 0
      }}>Phone Number</h3>
      <p style={{
        fontFamily: 'Fustat',
        fontWeight: 500,
        fontSize: '18px',
        lineHeight: '150%',
        letterSpacing: '0%',
        textAlign: 'center',
        width: '100%',
        minHeight: '26px',
        opacity: 1,
        color: '#6B7280',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        +91 8870094007
      </p>
    </div>
  </div>
</div>
    </div>
  );
}
