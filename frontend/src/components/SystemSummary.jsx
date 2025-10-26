import React, { useState, useEffect, useCallback } from 'react';
import { roomAPI, deviceAPI, alertAPI, locationAPI } from '../services/api';
import Sidebar from './Sidebar';
import StatCard from './StatCard';
import AlertsCard from './AlertsCard';
import FloorplanCard from './FloorplanCard';
// import LocationsList from './LocationsList';
import DeviceCharts from './DeviceCharts';

const SystemSummary = () => {
  const [deviceStats, setDeviceStats] = useState(null);
  const [roomStats, setRoomStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  // const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      
      const [deviceStatsResp, roomStatsResp, alertsResp, locationsResp] = await Promise.all([
        deviceAPI.getDeviceStats(),
        roomAPI.getRoomStats(),
        alertAPI.getAllAlerts(),
        locationAPI.getAllLocations()
      ]);

      setDeviceStats(deviceStatsResp.data || deviceStatsResp);
      setRoomStats(roomStatsResp.data || roomStatsResp);
      setAlerts((alertsResp.data || alertsResp).slice(0, 3)); // Show only 3 alerts
      // setLocations(locationsResp.data || locationsResp);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AITS</span>
              </div>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">AV Monitoring - System Summary</h1>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>Contact for AV Service</span>
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Devices Online Card */}
            <StatCard
              title="Devices Online"
              subtitle={`${deviceStats?.percentage || 0}% of devices are online.`}
              trend="↑ 2% vs last month"
              trendColor="green"
              value={deviceStats?.online || 0}
              total={deviceStats?.total || 0}
              label="of 300 devices"
              gaugeColor="purple"
              loading={loading}
            />

            {/* Meeting Room Availability Card */}
            <StatCard
              title="Meeting Room Availability"
              subtitle={`${roomStats?.percentage || 0}% of rooms available.`}
              trend="↑ 2% vs last month"
              trendColor="green"
              value={roomStats?.available || 0}
              total={roomStats?.total || 0}
              label="of 30 rooms"
              gaugeColor="green"
              loading={loading}
            />

            {/* Alerts Card */}
            <AlertsCard alerts={alerts} loading={loading} />
          </div>

          {/* Floorplan and Locations Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FloorplanCard loading={loading} />
            {/* <LocationsList locations={locations} loading={loading} /> */}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DeviceCharts loading={loading} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SystemSummary;
