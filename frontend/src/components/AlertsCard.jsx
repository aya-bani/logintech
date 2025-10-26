import React from 'react';

const AlertsCard = ({ alerts, loading }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return 'More than a day ago';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
          <div className="h-6 bg-gray-200 rounded w-8"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">Alerts</h3>
        <span className="bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
          {alerts?.length || 0}
        </span>
      </div>

      {alerts && alerts.length > 0 ? (
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <div key={alert.id || index} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">Device Offline</span>
                    <span className="text-xs text-gray-500">{formatTime(alert.timestamp)}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">
                    {alert.name || 'Unknown Device'}
                    {alert.location && ` in ${alert.location}`}
                  </p>
                  {(alert.roomName || alert.deviceType) && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {alert.roomName && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {alert.roomName}
                        </span>
                      )}
                      {alert.deviceType && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {alert.deviceType}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No alerts</p>
        </div>
      )}

      {alerts && alerts.length > 0 && (
        <button className="mt-4 w-full text-sm text-blue-600 hover:text-blue-800 font-medium">
          Show more
        </button>
      )}
    </div>
  );
};

export default AlertsCard;
