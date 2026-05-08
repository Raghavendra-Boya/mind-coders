"use client";
import React from "react";
import { MoreVertical } from "lucide-react";

export default function RequestPrayerTable({
  data,
  page,
  setPage,
  totalPages,
  start,
  filtered,
  itemsPerPage,
  setItemsPerPage,
}) {
  return (
<>
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
         <thead>
  <tr style={{
    backgroundColor: '#F3F4F6',
    height: '48px',
    borderBottom: '1px solid #E5E7EB'
  }}>
    <th style={{
      textAlign: 'left',
      padding: '0 16px',
      fontWeight: 600,
      fontSize: '12px',
      lineHeight: '16px',
      color: '#374151',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      borderTopLeftRadius: '6px',
      borderBottomLeftRadius: '6px'
    }}>NAME</th>
    <th style={{
      textAlign: 'left',
      padding: '0 16px',
      fontWeight: 600,
      fontSize: '12px',
      lineHeight: '16px',
      color: '#374151',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }}>EMAIL</th>
    <th style={{
      textAlign: 'left',
      padding: '0 16px',
      fontWeight: 600,
      fontSize: '12px',
      lineHeight: '16px',
      color: '#374151',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }}>MOBILE NUMBER</th>
    <th style={{
      textAlign: 'left',
      padding: '0 16px',
      fontWeight: 600,
      fontSize: '12px',
      lineHeight: '16px',
      color: '#374151',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }}>LOCATION</th>
    <th style={{
      textAlign: 'left',
      padding: '0 16px',
      fontWeight: 600,
      fontSize: '12px',
      lineHeight: '16px',
      color: '#374151',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }}>COMMENTS</th>
    <th style={{
      textAlign: 'right',
      padding: '0 24px 0 16px',
      fontWeight: 600,
      fontSize: '12px',
      lineHeight: '16px',
      color: '#374151',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      borderTopRightRadius: '6px',
      borderBottomRightRadius: '6px'
    }}>ACTIONS</th>
  </tr>
</thead>

          <tbody>
            {data.length > 0 ? (
              data.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                >
                  <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer">
                    {row.name}
                  </td>
                  <td className="px-4 py-3">{row.email}</td>
                  <td className="px-4 py-3">{row.mobilenumber}</td>
                  <td className="px-4 py-3">{row.location}</td>
                  <td className="px-4 py-3 text-gray-700 truncate max-w-xs">
                    {row.comment}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-1 rounded-md hover:bg-gray-100">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-6 text-gray-400 italic"
                >
                  No requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

   
    </div>
   {/* Pagination */}
      <div className="flex items-center justify-between p-3 border-t border-gray-100 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <label>Items per page</label>
          <select
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            {[10, 20, 30, 50].map((val) => (
              <option key={val}>{val}</option>
            ))}
          </select>
        </div>

        <div>
          Showing {start + 1}-{Math.min(start + itemsPerPage, filtered.length)} of{" "}
          {filtered.length} Results
        </div>

        <div className="flex items-center space-x-1">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-3 py-1 border rounded-md ${
              page === 1
                ? "text-gray-400 border-gray-200"
                : "hover:bg-gray-100"
            }`}
          >
            &lt;
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded-md ${
                page === i + 1
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-3 py-1 border rounded-md ${
              page === totalPages
                ? "text-gray-400 border-gray-200"
                : "hover:bg-gray-100"
            }`}
          >
            &gt;
          </button>
        </div>
      </div>
</>

  

  );
}
