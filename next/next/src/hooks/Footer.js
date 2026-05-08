'use client';
import { fetchContactData } from "@/store/slices/ContactSlice";
import { useEffect } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";


export default function Footer() {
  const dispatch = useDispatch();

  const { data = [], loading, error } = useSelector((state) => state.contact);

  const contact = data?.[0];

  useEffect(() => {
    dispatch(fetchContactData());
  }, [dispatch]);
  return (
    <footer className="bg-white text-gray-700 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo + Description */}
        <div className="ml-12">
          <img
            src="/asset/Rakshana Logo.svg"
            alt="Rakshana TV Logo"
            style={{
              width: '190px',
              height: '124px',
              opacity: 1
            }}
            className="mb-4"
          />
          <p className="mb-6 w-[288px] h-[63px] font-['Onest'] font-light text-sm leading-[150%] tracking-[0%] opacity-100">
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.
            Velit officia consequat duis enim velit mollit.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4">
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
              <FaFacebookF className="text-xl text-gray-600" />
            </a>
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
              <FaTwitter className="text-xl text-gray-600" />
            </a>
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
              <FaYoutube className="text-xl text-gray-600" />
            </a>
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
              <FaLinkedinIn className="text-xl text-gray-600" />
            </a>
          </div>
        </div>

        {/* Company 1 */}
        <div className="ml-20">
          <h3
            className="w-[92px] h-[30px] font-['Fustat'] font-bold text-[20px] leading-[30px] tracking-[0%] opacity-100 mb-4"
          >
            Company
          </h3>
          <ul
            className="w-[81.89px] h-[170px] font-['Fustat'] font-medium text-[16px] leading-[26px] tracking-[0%] opacity-100 space-y-3"
          >
            <li><a href="#" className="hover:text-gray-900 block">Home</a></li>
            <li><a href="#" className="hover:text-gray-900 block">About Us</a></li>
            <li><a href="#" className="hover:text-gray-900 block">Watch Live</a></li>
            <li><a href="#" className="hover:text-gray-900 block">Programs</a></li>
            <li><a href="#" className="hover:text-gray-900 block">Contact Us</a></li>
          </ul>
        </div>

       {/* Company 2 */}
<div className="ml-2"> 
<h3 
  className="w-[91px] h-[30px] font-['Fustat'] font-bold text-[20px] leading-[30px] tracking-[0%] opacity-100 mb-4"
  style={{
    position: 'relative',
  }}
>
  Company
</h3>
 <ul 
  className="w-[166px] h-[98px] font-['Fustat'] font-medium text-[16px] leading-[26px] tracking-[0%] opacity-100 space-y-3"
  style={{
    position: 'relative',
  }}
>
  <li><a href="#" className="hover:text-gray-900 block">Broadcast Slot Booking</a></li>
  <li><a href="#" className="hover:text-gray-900 block">Prayer Request Booking</a></li>
  <li><a href="#" className="hover:text-gray-900 block">Donate</a></li>
</ul>
</div>
        {/* Contact */}
        <div>
<h3 
  className="w-[118px] h-[30px] font-['Fustat'] font-bold text-[20px] leading-[30px] tracking-[0%] opacity-100 mb-4"
  style={{
    position: 'relative',
  }}
>
  Get in Touch
</h3>
          <ul className="space-y-4 text-sm">

            {/* Name / Company */}
           <li 
  className="flex items-start gap-3"
  style={{
    width: '281px',
    height: '46px',
    position: 'relative',
  }}
>
  <FaMapMarkerAlt className="text-gray-500 flex-shrink-0 mt-1" />
  <span className="font-['Fustat'] font-medium text-[16px] leading-[100%] tracking-[0%] opacity-100">
    <strong>{contact?.Name || "Name Not Available"}</strong><br />
    {contact?.Address || "Address Not Available"}
  </span>
</li>

            {/* Phone */}
        <li 
  className="flex items-center gap-3"
  style={{
    position: 'relative',
  }}
>
  <FaPhoneAlt className="text-gray-500" />
  <span className="font-['Fustat'] font-medium text-[16px] leading-[100%] tracking-[0%] opacity-100">
    {contact?.PhoneNumber || "Phone Not Available"}
  </span>
</li>
            {/* Email */}
           <li 
  className="flex items-center gap-3"
  style={{
    position: 'relative',
  }}
>
  <FaEnvelope className="text-gray-500" />
  <span 
    className="font-['Fustat'] font-medium text-[16px] leading-[100%] tracking-[0%] opacity-100"
    style={{
      width: '174px',
    }}
  >
    {contact?.Email || "Email Not Available"}
  </span>
</li>

          </ul>
        </div>


      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 mt-4">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
          <p>Copyright ©2025 Rakshana TV</p>
          <div className="flex gap-6 mt-3 md:mt-0">
            <a href="#" className="hover:text-gray-900">Terms of Use</a>
            <a href="#" className="hover:text-gray-900">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
