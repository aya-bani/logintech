import React from 'react';

const FloorplanCard = ({ loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Office Floorplan</h3>
      <div className="bg-gray-100 rounded-lg p-4 h-64 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-24 h-24 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <p className="text-gray-500 text-sm">Floorplan visualization</p>
          <p className="text-gray-400 text-xs mt-1">Interactive map coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default FloorplanCard;
