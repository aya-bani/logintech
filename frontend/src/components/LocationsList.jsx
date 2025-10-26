import React from 'react';

const LocationsList = ({ locations, loading }) => {
  const getCountryFlag = (location) => {
    const flagMap = {
      'America': '🇺🇸',
      'India': '🇮🇳',
      'United Kingdom': '🇬🇧',
      'Australia': '🇦🇺',
      'Canada': '🇨🇦',
      'Melbourne': '🇦🇺',
      'AUS': '🇦🇺',
    };
    
    for (const [key, flag] of Object.entries(flagMap)) {
      if (location?.toLowerCase().includes(key.toLowerCase())) {
        return flag;
      }
    }
    return '🌍';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const sampleLocations = [
    { name: 'America', devices: '3 of 10 online' },
    { name: 'India', devices: '5 of 8 online' },
    { name: 'United Kingdom', devices: '2 of 6 online' },
    { name: 'Australia', devices: '4 of 7 online' },
    { name: 'Canada', devices: '1 of 3 online' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Meeting Rooms</h3>
      <div className="space-y-2">
        {sampleLocations.map((location, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <span className="text-2xl">{getCountryFlag(location.name)}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{location.name}</p>
              <p className="text-xs text-gray-500">{location.devices}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationsList;
