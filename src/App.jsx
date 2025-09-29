/* eslint-disable no-undef */


import React from 'react';
import { useEffect } from 'react';
import { useRedirects } from './hooks/useRedirects';
import RedirectList from './components/RedirectList';
import ClearButton from './components/ClearButton';

function App() {
  const { redirects, loading, error, refresh } = useRedirects();

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.action?.getBadgeText) {
      chrome.action.getBadgeText({}, (text) => {
        if (text === 'NEW') {
          chrome.action.setBadgeText({ text: '' });
        }
      });
    }
  }, []); // run once when popup opens

  return (
    <div className="min-w-[320px] max-w-sm p-4 bg-white rounded-lg shadow-lg">
      <h1 className="text-xl font-bold text-center mb-4 text-gray-800">
         Link Redirect Tracker
      </h1>

      {error && (
        <p className="text-red-500 text-center mb-2 text-sm">{error}</p>
      )}

      <button
        onClick={refresh}
        className="w-full bg-blue-100 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors mb-4 cursor-pointer "
      >
        Refresh
      </button>

      <RedirectList redirects={redirects} loading={loading} error={error} />

      {redirects.length > 0 && (
        <div className="mt-4">
          <ClearButton />
        </div>
      )}

      <p className="text-xs text-gray-500 text-center mt-4">
        Tip: Open https://httpbin.org/redirect/2 to test!
      </p>
    </div>
  );
}

export default App;
