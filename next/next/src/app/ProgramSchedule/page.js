"use client";

import Navbar from "@/components/Navbar";
import DownloadApp from "../download/page";
import Footer from "@/components/Footer";

const ProgramSchedule = () => {
  return (
    <>
      <div className="max-w-[1200px] mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <Navbar/>
        <div className="text-center mt-20">
          <h2 className="text-4xl md:text-5xl font-extrabold">Programs Schedule</h2>
          <p className="text-gray-500 mt-3 max-w-[700px] mx-auto text-base md:text-lg">
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. 
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.
          </p>
        </div>

        {/* Top Bar with Dropdown */}
        <div className="flex justify-end mt-6">
          <select className="border rounded-md px-3 py-2 text-sm md:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
            <option>India</option>
            <option>USA</option>
            <option>UK</option>
            <option>Canada</option>
          </select>
        </div>

        {/* Responsive Schedule */}
        <div className="mt-10 hidden md:block">
          {/* Desktop Table */}
          <table className="w-full border-collapse text-center">
            {/* Table Head */}
            <thead>
              <tr>
                <th className="bg-purple-500 text-white p-3 rounded-tl-xl">Telecasting Time</th>
                <th className="bg-pink-500 text-white p-3">MON</th>
                <th className="bg-pink-500 text-white p-3">TUE</th>
                <th className="bg-pink-500 text-white p-3">WED</th>
                <th className="bg-pink-500 text-white p-3">THU</th>
                <th className="bg-pink-500 text-white p-3">FRI</th>
                <th className="bg-pink-500 text-white p-3">SAT</th>
                <th className="bg-pink-500 text-white p-3 rounded-tr-xl">SUN</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {/* Row 1 */}
              <tr>
                <td className="bg-purple-200 p-3 font-semibold">5:00AM – 5:30AM</td>
                <td className="bg-teal-400 text-white font-semibold">
                  Happy Greetings
                  <img src="/speaker.png" alt="Speaker" className="mx-auto mt-2 w-10 h-10 rounded-full" />
                </td>
                <td className="bg-teal-400 text-white font-semibold">
                  Happy Greetings
                  <img src="/speaker.png" alt="Speaker" className="mx-auto mt-2 w-10 h-10 rounded-full" />
                </td>
                <td className="bg-teal-400 text-white font-semibold">
                  Happy Greetings
                  <img src="/speaker.png" alt="Speaker" className="mx-auto mt-2 w-10 h-10 rounded-full" />
                </td>
                <td className="bg-red-200 text-red-600 font-bold">JESUS CALLS</td>
                <td className="bg-green-200 text-green-700 font-bold">HAPPY GREETINGS</td>
                <td className="bg-red-200 text-red-600 font-bold">JESUS CALLS</td>
                <td className="bg-green-200 text-green-700 font-bold">HAPPY GREETINGS</td>
              </tr>

              {/* Row 2 */}
              <tr>
                <td className="bg-purple-200 p-3 font-semibold">5:00AM – 5:30AM</td>
                <td className="bg-red-200 text-red-600 font-bold">JESUS CALLS</td>
                <td className="bg-green-200 text-green-700 font-bold">HAPPY GREETINGS</td>
                <td className="bg-red-200 text-red-600 font-bold">JESUS CALLS</td>
                <td className="bg-green-200 text-green-700 font-bold">HAPPY GREETINGS</td>
                <td className="bg-red-200 text-red-600 font-bold">JESUS CALLS</td>
                <td className="bg-green-200 text-green-700 font-bold">HAPPY GREETINGS</td>
                <td className="bg-green-200 text-green-700 font-bold">HAPPY GREETINGS</td>
              </tr>

              {/* Row 3 */}
              <tr>
                <td className="bg-purple-200 p-3 font-semibold">5:00AM – 5:30AM</td>
                <td className="bg-green-200 text-green-700 font-bold">HAPPY GREETINGS</td>
                <td className="bg-red-200 text-red-600 font-bold">JESUS CALLS</td>
                <td className="bg-green-200 text-green-700 font-bold">HAPPY GREETINGS</td>
                <td className="bg-red-200 text-red-600 font-bold">JESUS CALLS</td>
                <td className="bg-green-200 text-green-700 font-bold">HAPPY GREETINGS</td>
                <td className="bg-red-200 text-red-600 font-bold">JESUS CALLS</td>
                <td className="bg-green-200 text-green-700 font-bold">HAPPY GREETINGS</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile View (Cards instead of Table) */}
        <div className="mt-10 grid gap-6 md:hidden">
          {[
            {
              time: "5:00AM – 5:30AM",
              days: [
                { day: "Mon", text: "Happy Greetings", type: "greeting" },
                { day: "Tue", text: "Happy Greetings", type: "greeting" },
                { day: "Wed", text: "Happy Greetings", type: "greeting" },
                { day: "Thu", text: "JESUS CALLS", type: "jesus" },
                { day: "Fri", text: "HAPPY GREETINGS", type: "greeting" },
                { day: "Sat", text: "JESUS CALLS", type: "jesus" },
                { day: "Sun", text: "HAPPY GREETINGS", type: "greeting" },
              ],
            },
          ].map((row, idx) => (
            <div key={idx} className="border rounded-xl shadow p-4 bg-white">
              <p className="font-bold text-purple-600 mb-2">{row.time}</p>
              <div className="grid grid-cols-2 gap-3">
                {row.days.map((d, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg text-center font-semibold ${
                      d.type === "greeting"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    <p>{d.day}</p>
                    <p>{d.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <DownloadApp />
      <Footer />
    </>
  );
};

export default ProgramSchedule;
