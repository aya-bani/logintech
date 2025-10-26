import React from 'react';

const StatCard = ({ title, subtitle, trend, trendColor, value, total, label, gaugeColor, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-24 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  const isGreen = trendColor === 'green';

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <span className={`text-sm font-medium ${isGreen ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
        </span>
      </div>

      {/* Semi-circular Gauge */}
      <div className="relative w-full h-32 flex items-end justify-center">
        <svg viewBox="0 0 200 100" className="w-full h-32">
          {/* Background arc */}
          <path
            d="M 20 80 A 80 80 0 0 1 180 80"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Filled arc */}
          <path
            d={`M 20 80 A 80 80 0 0 1 ${20 + (percentage / 100) * 160} ${80 - Math.sin((percentage / 100) * Math.PI) * 80}`}
            fill="none"
            stroke={gaugeColor === 'purple' ? '#8b5cf6' : '#10b981'}
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Value text */}
          <text
            x="100"
            y="75"
            textAnchor="middle"
            fontSize="36"
            fontWeight="bold"
            fill={gaugeColor === 'purple' ? '#8b5cf6' : '#10b981'}
          >
            {value}
          </text>
        </svg>
      </div>

      <p className="text-center text-sm text-gray-600 mt-2">{label}</p>
    </div>
  );
};

export default StatCard;
