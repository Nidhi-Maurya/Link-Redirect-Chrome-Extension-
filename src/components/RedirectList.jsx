import React from "react";

const RedirectList = ({ redirects, loading, error }) => {
  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (redirects.length === 0) return <p className="text-center text-gray-500">No redirects yet.</p>;

  return (
    <div className="space-y-3 max-h-80 overflow-y-auto">
      {redirects.map((step, index) => (
        <div key={index} className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-500">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-gray-700">Step {index + 1}</span>
            <span className={`px-2 py-1 rounded text-xs ${
              step.statusCode >= 300 && step.statusCode < 400 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-green-200 text-green-800'
            }`}>
              {step.statusCode || 'N/A'}
            </span>
          </div>
          <p className="text-xs text-blue-600 break-all">{step.fromUrl?.substring(0, 60)}...</p>
          {step.type === 'Redirect' && <p className="text-xs text-green-600 mt-1">Redirecting...</p>}
          {step.type === 'Final' && <p className="text-xs text-green-600 mt-1">Final Page</p>}
        </div>
      ))}
    </div>
  );
};

export default RedirectList;