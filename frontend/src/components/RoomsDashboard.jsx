import React, { useState, useEffect, useCallback } from 'react';
import { roomAPI } from '../services/api';
import RoomStatsCard from './RoomStatsCard';
import RoomsList from './RoomsList';
import RoomDetail from './RoomDetail';

const RoomsDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      
      // Fetch both rooms and stats in parallel
      const [roomsResponse, statsResponse] = await Promise.all([
        roomAPI.getAllRooms(),
        roomAPI.getRoomStats()
      ]);

      // Handle the response structure - check if data is nested
      const roomsData = roomsResponse.data || roomsResponse;
      const statsData = statsResponse.data || statsResponse;

      setRooms(roomsData);
      setStats(statsData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch room data');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRoomClick = async (room) => {
    try {
      setLoading(true);
      setError(null);
      
      const roomDetail = await roomAPI.getRoomById(room.id);
      const roomData = roomDetail.data || roomDetail;
      
      setSelectedRoom(roomData);
    } catch (err) {
      console.error('Error fetching room details:', err);
      setError(err.message || 'Failed to fetch room details');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedRoom(null);
    setError(null);
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AV Monitoring Dashboard</h1>
          <p className="text-gray-600 mt-2">Real-time room availability and device status</p>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-red-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Connection Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <button
                  onClick={fetchData}
                  className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {selectedRoom ? (
          <RoomDetail
            room={selectedRoom}
            loading={loading}
            error={error}
            onBack={handleBackToList}
          />
        ) : (
          <div className="space-y-6">
            {/* Stats Card */}
            <RoomStatsCard
              stats={stats}
              loading={loading}
              error={error}
            />

            {/* Rooms List */}
            <RoomsList
              rooms={rooms}
              loading={loading}
              error={error}
              onRoomClick={handleRoomClick}
            />
          </div>
        )}

        {/* Loading Overlay */}
        {loading && !selectedRoom && (
          <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">Loading room data...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomsDashboard;
