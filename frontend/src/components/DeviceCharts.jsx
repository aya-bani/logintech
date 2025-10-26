import React from 'react';

const DeviceCharts = ({ loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-64 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">Monthly Device Uptime by Type</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Search Report
        </button>
      </div>
      <div className="bg-gray-50 rounded-lg p-4 h-64 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-24 h-24 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-gray-500 text-sm">Chart visualization</p>
          <p className="text-gray-400 text-xs mt-1">Coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default DeviceCharts;
