"use client";
import React, { memo, useCallback, useMemo, useEffect, useState, useRef } from 'react';
import { useRouter } from "next/navigation";

// Debounced localStorage function
const debouncedLocalStorage = (key, value) => {
  if (typeof window === 'undefined') return;
  
  // Clear any pending updates for this key
  if (debouncedLocalStorage.timeouts && debouncedLocalStorage.timeouts[key]) {
    clearTimeout(debouncedLocalStorage.timeouts[key]);
  }
  
  // Set a new timeout
  debouncedLocalStorage.timeouts = debouncedLocalStorage.timeouts || {};
  debouncedLocalStorage.timeouts[key] = setTimeout(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      delete debouncedLocalStorage.timeouts[key];
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, 100); // 100ms debounce
};

// Custom hook for localStorage state with optimizations
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue;
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Only update state and localStorage if the value has changed
      setStoredValue(prev => {
        if (JSON.stringify(prev) === JSON.stringify(valueToStore)) {
          return prev;
        }
        debouncedLocalStorage(key, valueToStore);
        return valueToStore;
      });
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

// Custom debounce implementation
function debounce(func, wait) {
  let timeout;
  const debounced = function(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
  
  debounced.cancel = function() {
    clearTimeout(timeout);
  };
  
  return debounced;
}

// Memoized Table Row component with optimized re-renders
const TableRow = React.memo(({ row, entityLabel, onRowClick, rowId }) => {
  const handleClick = useCallback(() => {
    onRowClick(rowId);
  }, [onRowClick, rowId]);

  return (
    <tr className="h-14 border-b last:border-b-0 hover:bg-slate-50 transition">
      <td
        onClick={handleClick}
        className="px-4 text-[#1677ff] hover:underline text-sm cursor-pointer"
      >
        {row.name || "—"}
      </td>
      <td className="text-center text-sm">
        {row.episodeCount || 0}
      </td>
      <td className="text-center">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs ${
            (row.status || "").toLowerCase() === "active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.status || "Unknown"}
        </span>
      </td>
      <td className="text-center text-sm text-slate-500">
        {row.createdAt}
      </td>
    </tr>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  return (
    prevProps.rowId === nextProps.rowId &&
    prevProps.row.name === nextProps.row.name &&
    prevProps.row.status === nextProps.row.status &&
    prevProps.row.episodeCount === nextProps.row.episodeCount &&
    prevProps.row.createdAt === nextProps.row.createdAt
  );
});
TableRow.displayName = 'TableRow';

// Memoized Table Header component
const TableHeader = memo(({ headerLabel }) => (
  <thead>
    <tr className="h-10 bg-gray-50 border-b border-gray-200">
      <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
        {headerLabel}
      </th>
      <th className="text-center px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
        EPISODES
      </th>
      <th className="text-center px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
        STATUS
      </th>
      <th className="text-right px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
        CREATED DATE
      </th>
    </tr>
  </thead>
));
TableHeader.displayName = 'TableHeader';

// Debounced function to save to localStorage
const saveToLocalStorage = (key, value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// Main Table component
const DashboardTable = ({
  data = [],
  page: externalPage,
  setPage: setExternalPage,
  totalPages: externalTotalPages = 1,
  itemsPerPage: externalItemsPerPage,
  setItemsPerPage: setExternalItemsPerPage,
  entityLabel = "Program",
  loading = false,
}) => {
  const router = useRouter();
  
  // Use localStorage for state persistence
  const [tableState, setTableState] = useLocalStorage('tableState', {
    page: 1,
    itemsPerPage: 10
  });
  
  // Initialize state with proper fallbacks
  const [page, setPage] = useState(() => {
    return externalPage !== undefined ? externalPage : (tableState?.page || 1);
  });
  
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    return externalItemsPerPage !== undefined ? externalItemsPerPage : (tableState?.itemsPerPage || 10);
  });
  
  const [localData, setLocalData] = useState(() => (Array.isArray(data) ? data : []));
  
  // Update localStorage when state changes with debounce
  useEffect(() => {
    if (page !== undefined && itemsPerPage !== undefined) {
      debouncedLocalStorage('tableState', { page, itemsPerPage });
    }
    // Cleanup function to cancel any pending updates on unmount
    return () => {
      if (debouncedLocalStorage.timeouts) {
        Object.values(debouncedLocalStorage.timeouts).forEach(clearTimeout);
      }
    };
  }, [page, itemsPerPage]);
  
  const rows = useMemo(() => localData, [localData]);
  const headerLabel = useMemo(() => 
    entityLabel ? `${entityLabel.toUpperCase()} NAME` : 'PROGRAM NAME', 
    [entityLabel]
  );
  
  const totalItems = rows.length;
  const start = (page - 1) * itemsPerPage;
  const end = Math.min(start + itemsPerPage, totalItems);
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  
  // Sync local state with props
  useEffect(() => {
    setLocalData(Array.isArray(data) ? data : []);
  }, [data]);
  
  // Debounce localStorage updates with custom implementation
  const debouncedSave = useRef(
    debounce((currentPage, currentItemsPerPage) => {
      saveToLocalStorage('tableState', {
        page: currentPage,
        itemsPerPage: currentItemsPerPage,
      });
    }, 300)
  ).current;
  
  // Sync with parent component if controlled
  useEffect(() => {
    if (externalPage !== undefined && externalPage !== page) {
      setPage(externalPage);
    }
  }, [externalPage]); // Only depend on externalPage
  
  useEffect(() => {
    if (externalItemsPerPage !== undefined && externalItemsPerPage !== itemsPerPage) {
      setItemsPerPage(externalItemsPerPage);
    }
  }, [externalItemsPerPage]); // Only depend on externalItemsPerPage
  
  // Memoize row click handler
  const handleRowClick = useCallback((id) => {
    if (id) {
      router.push(`/dashboard/programs/${id}`);
    }
  }, [router]);

  // Handle page change
  const handlePageChange = useCallback((newPage) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages));
    
    // Only update if the page actually changes
    setPage(prevPage => {
      if (prevPage === validPage) return prevPage;
      
      // Notify parent component if controlled
      if (setExternalPage) setExternalPage(validPage);
      
      // Scroll to top for better UX
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      return validPage;
    });
  }, [totalPages, setExternalPage]);

  // Handle items per page change
  const handleItemsPerPageChange = useCallback((e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    
    // Only update if the value actually changes
    setItemsPerPage(prevItemsPerPage => {
      if (prevItemsPerPage === newItemsPerPage) return prevItemsPerPage;
      
      // Reset to first page when changing items per page
      setPage(1);
      
      // Notify parent component if controlled
      if (setExternalPage) setExternalPage(1);
      if (setExternalItemsPerPage) setExternalItemsPerPage(newItemsPerPage);
      
      return newItemsPerPage;
    });
  }, [setExternalItemsPerPage, setExternalPage]);

  // Memoize pagination controls
  const paginationControls = useMemo(() => {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 text-sm text-slate-500 gap-4">
        <div className="flex items-center gap-3">
          <span className="whitespace-nowrap">Items per page</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border rounded px-2 py-1 bg-white text-sm w-20"
            aria-label="Items per page"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={`opt-${n}`} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="text-center whitespace-nowrap">
          Showing {Math.min(start + 1, totalItems)}-{end} of {totalItems} Results
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-50 transition-colors"
            aria-label="Previous page"
          >
            &lt;
          </button>
          <div className="px-3 py-1 border rounded bg-white min-w-[40px] text-center">
            {page}
          </div>
          <button
            disabled={page >= totalPages}
            onClick={() => handlePageChange(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-50 transition-colors"
            aria-label="Next page"
          >
            &gt;
          </button>
        </div>
      </div>
    );
  }, [page, totalPages, itemsPerPage, start, end, totalItems, handlePageChange, handleItemsPerPageChange]);

  // Loading state
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {Array.from({ length: Math.min(5, itemsPerPage) }).map((_, i) => (
          <div key={`skeleton-${i}`} className="h-14 bg-gray-100 rounded-md"></div>
        ))}
      </div>
    );
  }

  // Memoize the table rows with optimized rendering
  const tableRows = useMemo(() => {
    if (rows.length === 0) {
      return (
        <tr>
          <td colSpan="4" className="text-center py-6 text-gray-400 italic">
            {`No ${entityLabel.toLowerCase()}s found.`}
          </td>
        </tr>
      );
    }
    
    return rows.slice(start, end).map((row) => (
      <TableRow
        key={`row-${row.id}`}
        row={row}
        entityLabel={entityLabel}
        onRowClick={handleRowClick}
        rowId={row.id}
      />
    ));
  }, [rows, start, end, entityLabel, handleRowClick]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-md shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <TableHeader headerLabel={headerLabel} />
            <tbody className="bg-white divide-y divide-gray-200">
              {tableRows}
            </tbody>
          </table>
        </div>
      </div>
      {totalItems > 0 && paginationControls}
    </div>
  );
};

export default memo(DashboardTable);
