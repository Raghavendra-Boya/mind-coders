import { useState, useEffect, useCallback } from 'react';

export function useLocalState(key, initialValue, options = {}) {
  const { cacheDuration = 5 * 60 * 1000 } = options; // 5 minutes default cache
  
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') return initialValue;
    
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;
      
      const { value, timestamp } = JSON.parse(item);
      
      // Check if cache is still valid
      if (Date.now() - timestamp > cacheDuration) {
        return initialValue;
      }
      
      return value;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(state) : value;
      setState(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(
          key,
          JSON.stringify({
            value: valueToStore,
            timestamp: Date.now()
          })
        );
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setValue];
}
