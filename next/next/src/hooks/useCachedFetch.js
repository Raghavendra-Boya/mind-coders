import { useState, useEffect, useCallback } from 'react';

export function useCachedFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    const cacheKey = `cache_${url}`;
    const cacheExpiry = 5 * 60 * 1000; // 5 minutes cache

    try {
      setLoading(true);
      
      // Check cache first
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(cacheKey);
        const now = new Date().getTime();
        
        if (cached) {
          try {
            const { data: cachedData, timestamp } = JSON.parse(cached);
            if (now - timestamp < cacheExpiry) {
              setData(cachedData);
              setLoading(false);
              return; // Use cached data
            }
          } catch (e) {
            console.error('Error parsing cached data:', e);
            // Continue to fetch fresh data if cache is corrupted
          }
        }
      }

      // Fetch fresh data
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const result = await response.json();
      
      // Update cache if we're in the browser
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(cacheKey, JSON.stringify({
            data: result,
            timestamp: new Date().getTime()
          }));
        } catch (e) {
          console.error('Error saving to cache:', e);
        }
      }

      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh };
}
