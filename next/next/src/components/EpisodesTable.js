"use client";
import { MoreVertical } from "lucide-react";

export function EpisodesTable({ data, loading }) {
  if (loading) return <p className="text-gray-500">Loading episodes...</p>;

  return (
    <div className="bg-white rounded-md shadow w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 whitespace-nowrap">EPISODE NAME</th>
              <th className="p-3 whitespace-nowrap">STATUS</th>
              <th className="p-3 whitespace-nowrap">CREATED</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((ep) => (
              <tr key={ep.SNo} className="border-b hover:bg-gray-50">
                <td className="p-3 text-blue-600 hover:underline whitespace-nowrap">
                  {ep.EpisodeName}
                </td>
                <td className="p-3 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      ep.Status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {ep.Status}
                  </span>
                </td>
                <td className="p-3 whitespace-nowrap">{ep.TrDate}</td>
                <td className="p-3 text-right">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && (
          <p className="text-gray-500 p-3">No episodes found.</p>
        )}
      </div>
    </div>
  );
}
