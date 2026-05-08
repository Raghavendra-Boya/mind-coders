"use client";
import { MoreVertical } from "lucide-react";

export function DonationsTable({
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
      {/* Responsive table wrapper */}
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
              }}>DONATOR NAME</th>
              <th style={{
                textAlign: 'left',
                padding: '0 16px',
                fontWeight: 600,
                fontSize: '12px',
                lineHeight: '16px',
                color: '#374151',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>AMOUNT</th>
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
              data.map((ep) => (
                <tr
                  key={ep.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                >
                  <td className="py-3 px-4 text-blue-600 hover:underline">
                    {ep.name}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block bg-green-100 text-green-700 px-2 py-1 text-xs font-medium rounded-full">
                      {ep.amount}
                    </span>
                  </td>
                  <td className="py-3 px-4">{ep.mobilenumber}</td>
                  <td className="py-3 px-4 truncate max-w-xs">{ep.comment}</td>
                  <td className="py-3 px-4 text-right">
                    <button className="p-2 rounded-md hover:bg-gray-100">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-6 text-gray-400 italic"
                >
                  No donations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

   
    </div>
       {/* Pagination */}
      <div className="flex items-center justify-between p-3 border-t border-gray-100 text-sm text-slate-600">
        <div className="flex items-center gap-3">
          <span>Items per page</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="border rounded px-2 py-1 bg-white"
          >
            {[10, 20, 30, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
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
            className={`px-3 py-1 border rounded-md ${page === 1
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
              className={`px-3 py-1 rounded-md ${page === i + 1
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
            className={`px-3 py-1 border rounded-md ${page === totalPages
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
