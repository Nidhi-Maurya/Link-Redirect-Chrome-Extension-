/* eslint-disable no-undef */


import { useState, useEffect } from 'react';
import { getRedirects, clearRedirects } from '../utils/chromeAPI';

export const useRedirects = () => {
  const [redirects, setRedirects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getRedirects();
        setRedirects(data.redirects || []);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // ✅ Chrome storage change listener with guard
    let handleStorageChange;
    if (typeof chrome !== "undefined" && chrome.storage?.onChanged) {
      handleStorageChange = (changes) => {
        if (changes.allRedirects) {
          setRedirects(changes.allRedirects.newValue || []);
        }
      };

      chrome.storage.onChanged.addListener(handleStorageChange);
    }

    // Cleanup
    return () => {
      if (
        typeof chrome !== "undefined" &&
        chrome.storage?.onChanged &&
        handleStorageChange
      ) {
        chrome.storage.onChanged.removeListener(handleStorageChange);
      }
    };
  }, []);

  // const refresh = async () => {
  //   const data = await getRedirects();
  //   setRedirects(data.redirects || []);
  // };


const refresh = async () => {
    try {
      console.log("refreshed btn clicked");
      const data = await getRedirects();
console.log("Data received:", data);
      setRedirects(data.redirects || []);
    } catch (err) {
      console.error("Failed to fetch redirects:", err);
    }
  };


  const clear = async () => {
    await clearRedirects();
    setRedirects([]);
  };

  return { redirects, loading, error, refresh, clear };
};
