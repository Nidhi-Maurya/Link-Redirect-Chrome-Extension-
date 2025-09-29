import React from 'react';

import { useRedirects } from '../hooks/useRedirects';

const ClearButton = () => {
  const { clear } = useRedirects();

  return (
    <button
      onClick={clear}
      className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors md:w-auto"
    >
      Clear All Tracks
    </button>
  );
};

export default ClearButton;