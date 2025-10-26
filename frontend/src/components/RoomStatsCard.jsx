import React from 'react';

const RoomStatsCard = ({ stats, loading, error }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="text-red-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Stats</h3>
            <p className="text-sm text-red-700 mt-1">Failed to fetch room statistics</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const { total, available, unavailable, percentage } = stats;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Meeting Room Availability</h3>
          <p className="text-sm text-gray-600 mt-1">Real-time room status</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-green-600">{percentage}%</div>
          <div className="text-sm text-gray-500">Available</div>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{total}</div>
          <div className="text-sm text-gray-500">Total Rooms</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{available}</div>
          <div className="text-sm text-gray-500">Available</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{unavailable}</div>
          <div className="text-sm text-gray-500">Occupied</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Availability</span>
          <span>{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default RoomStatsCard;
