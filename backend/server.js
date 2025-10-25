const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logitech API Client
const logitechAPI = axios.create({
    baseURL: process.env.LOGITECH_BASE_URL,
    headers: {
        'Authorization': process.env.LOGITECH_AUTH_TOKEN,
        'Accept': 'application/json'
    },
    timeout: 10000
});

// Add request/response logging
logitechAPI.interceptors.request.use(config => {
    console.log(`→ ${config.method.toUpperCase()} ${config.url}`);
    return config;
});

logitechAPI.interceptors.response.use(
    response => {
        console.log(`✓ ${response.status} ${response.config.url}`);
        return response;
    },
    error => {
        console.error(`✗ ${error.message}`);
        if (error.response) {
            console.error(`  Status: ${error.response.status}`);
            console.error(`  Data:`, error.response.data);
            
            // If token expired, show instructions
            if (error.response.status === 401) {
                console.log('\n' + '='.repeat(70));
                console.log('⚠️  TOKEN EXPIRED - NEED TO REFRESH');
                console.log('='.repeat(70));
                console.log('📋 Steps to get a new token:');
                console.log('   1. Open Logitech Sync in your browser');
                console.log('   2. Refresh the page (F5)');
                console.log('   3. Open DevTools (F12) → Network tab → Fetch/XHR');
                console.log('   4. Click on any request (like "channel" or "info")');
                console.log('   5. Go to Headers tab → Request Headers section');
                console.log('   6. Copy the Authorization value (long token string)');
                console.log('   7. Update your .env file: LOGITECH_AUTH_TOKEN=new_token');
                console.log('   8. Restart this server: npm start');
                console.log('='.repeat(70) + '\n');
            }
        }
        return Promise.reject(error);
    }
);

// ==================== ROUTES ====================

// Home
app.get('/', (req, res) => {
    res.json({
        message: '🚀 AV Monitoring System - Backend API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            test: 'GET /api/test-inventory',
            rooms: 'GET /api/rooms',
            roomStats: 'GET /api/rooms/stats',
            roomDetails: 'GET /api/rooms/:id',
            devices: 'GET /api/devices',
            deviceStats: 'GET /api/devices/stats',
            alerts: 'GET /api/alerts',
            locations: 'GET /api/locations'
        }
    });
});

// TEST: Try to find rooms data
app.get('/api/test-inventory', async (req, res) => {
    try {
        const orgId = process.env.LOGITECH_ORG_ID;
        
        const tests = [
            `/inventory/${orgId}`,
            `/session/inventory/${orgId}`,
            `/org/${orgId}/inventory`,
            `/org/${orgId}/rooms`,
            `/org/${orgId}/essentialRooms`,
            `/api/org/${orgId}/rooms`,
            `/api/inventory/${orgId}`,
            `/api/session/inventory/${orgId}`,
            `/v1/inventory/${orgId}`,
            `/v1/org/${orgId}/inventory`,
        ];
        
        const results = {};
        
        for (const endpoint of tests) {
            try {
                console.log(`Testing: ${endpoint}`);
                const response = await logitechAPI.get(endpoint);
                results[endpoint] = {
                    status: 'success',
                    statusCode: response.status,
                    dataKeys: Object.keys(response.data || {}),
                    hasRooms: !!(response.data.essentialRooms || response.data.rooms),
                    dataType: Array.isArray(response.data) ? 'array' : typeof response.data,
                    sample: JSON.stringify(response.data).substring(0, 300) + '...'
                };
            } catch (err) {
                results[endpoint] = {
                    status: 'failed',
                    error: err.message,
                    statusCode: err.response?.status || 'N/A'
                };
            }
        }
        
        res.json({
            success: true,
            message: 'Tested multiple endpoints to find room data',
            results: results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get all rooms
app.get('/api/rooms', async (req, res) => {
    try {
        const orgId = process.env.LOGITECH_ORG_ID;
        
        // Try the channel endpoint that we know works
        const response = await logitechAPI.get(`/org/${orgId}/channel?realm=Rooms`);
        
        let rooms = [];
        
        // Handle different response structures
        if (response.data.essentialRooms) {
            rooms = response.data.essentialRooms;
        } else if (response.data.rooms) {
            rooms = response.data.rooms;
        } else if (Array.isArray(response.data)) {
            rooms = response.data;
        } else if (response.data.channels) {
            // This is channel data, not rooms - need different endpoint
            rooms = [];
        } else {
            rooms = response.data;
        }
        
        res.json({
            success: true,
            count: Array.isArray(rooms) ? rooms.length : 0,
            data: rooms,
            rawResponse: response.data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            details: error.response?.data || null
        });
    }
});

// Get room statistics
app.get('/api/rooms/stats', async (req, res) => {
    try {
        const orgId = process.env.LOGITECH_ORG_ID;
        const response = await logitechAPI.get(`/org/${orgId}/channel?realm=Rooms`);
        
        let rooms = [];
        if (response.data.essentialRooms) {
            rooms = response.data.essentialRooms;
        } else if (response.data.rooms) {
            rooms = response.data.rooms;
        } else if (Array.isArray(response.data)) {
            rooms = response.data;
        }
        
        // Calculate stats
        const totalRooms = rooms.length || 0;
        const availableRooms = rooms.filter(r => r.available === true || r.online === true).length;
        const percentage = totalRooms > 0 ? Math.round((availableRooms / totalRooms) * 100) : 0;
        
        res.json({
            success: true,
            data: {
                total: totalRooms,
                available: availableRooms,
                unavailable: totalRooms - availableRooms,
                percentage: percentage,
                changeVsLastMonth: 2
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get single room details
app.get('/api/rooms/:roomId', async (req, res) => {
    try {
        const orgId = process.env.LOGITECH_ORG_ID;
        const roomId = req.params.roomId;
        
        const response = await logitechAPI.get(`/org/${orgId}/room/${roomId}/info`);
        
        res.json({
            success: true,
            data: response.data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get room activity
app.get('/api/rooms/:roomId/activity', async (req, res) => {
    try {
        const orgId = process.env.LOGITECH_ORG_ID;
        const roomId = req.params.roomId;
        
        const response = await logitechAPI.get(`/org/${orgId}/room/${roomId}/activity`);
        
        res.json({
            success: true,
            data: response.data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get all devices (from all rooms)
app.get('/api/devices', async (req, res) => {
    try {
        const orgId = process.env.LOGITECH_ORG_ID;
        
        // First get all rooms
        const roomsResponse = await logitechAPI.get(`/org/${orgId}/channel?realm=Rooms`);
        
        let rooms = [];
        if (roomsResponse.data.essentialRooms) {
            rooms = roomsResponse.data.essentialRooms;
        } else if (roomsResponse.data.rooms) {
            rooms = roomsResponse.data.rooms;
        } else if (Array.isArray(roomsResponse.data)) {
            rooms = roomsResponse.data;
        }
        
        // Then get devices from each room
        const allDevices = [];
        
        for (const room of rooms) {
            if (room.devices && Array.isArray(room.devices)) {
                room.devices.forEach(device => {
                    allDevices.push({
                        ...device,
                        roomName: room.name,
                        roomId: room.id,
                        location: room.location
                    });
                });
            }
        }
        
        res.json({
            success: true,
            count: allDevices.length,
            data: allDevices
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get device statistics
app.get('/api/devices/stats', async (req, res) => {
    try {
        const orgId = process.env.LOGITECH_ORG_ID;
        const roomsResponse = await logitechAPI.get(`/org/${orgId}/channel?realm=Rooms`);
        
        let rooms = [];
        if (roomsResponse.data.essentialRooms) {
            rooms = roomsResponse.data.essentialRooms;
        } else if (roomsResponse.data.rooms) {
            rooms = roomsResponse.data.rooms;
        } else if (Array.isArray(roomsResponse.data)) {
            rooms = roomsResponse.data;
        }
        
        let totalDevices = 0;
        let onlineDevices = 0;
        
        rooms.forEach(room => {
            if (room.devices && Array.isArray(room.devices)) {
                totalDevices += room.devices.length;
                onlineDevices += room.devices.filter(d => d.online === true).length;
            }
        });
        
        const percentage = totalDevices > 0 ? Math.round((onlineDevices / totalDevices) * 100) : 0;
        
        res.json({
            success: true,
            data: {
                total: totalDevices,
                online: onlineDevices,
                offline: totalDevices - onlineDevices,
                percentage: percentage,
                changeVsLastMonth: 2
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get alerts (offline devices/rooms)
app.get('/api/alerts', async (req, res) => {
    try {
        const orgId = process.env.LOGITECH_ORG_ID;
        const roomsResponse = await logitechAPI.get(`/org/${orgId}/channel?realm=Rooms`);
        
        let rooms = [];
        if (roomsResponse.data.essentialRooms) {
            rooms = roomsResponse.data.essentialRooms;
        } else if (roomsResponse.data.rooms) {
            rooms = roomsResponse.data.rooms;
        } else if (Array.isArray(roomsResponse.data)) {
            rooms = roomsResponse.data;
        }
        
        const alerts = [];
        
        // Check for offline rooms
        rooms.forEach(room => {
            if (!room.available && !room.online) {
                alerts.push({
                    id: `room-${room.id}`,
                    type: 'Room Offline',
                    name: room.name,
                    location: room.location,
                    timestamp: room.lastSeen || new Date(),
                    severity: 'high'
                });
            }
            
            // Check for offline devices in each room
            if (room.devices && Array.isArray(room.devices)) {
                room.devices.forEach(device => {
                    if (!device.online) {
                        alerts.push({
                            id: `device-${device.id}`,
                            type: 'Device Offline',
                            name: device.name,
                            deviceType: device.type,
                            roomName: room.name,
                            location: room.location,
                            timestamp: device.lastSeen || new Date(),
                            severity: 'medium'
                        });
                    }
                });
            }
        });
        
        res.json({
            success: true,
            count: alerts.length,
            data: alerts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get locations/countries
app.get('/api/locations', async (req, res) => {
    try {
        const orgId = process.env.LOGITECH_ORG_ID;
        const roomsResponse = await logitechAPI.get(`/org/${orgId}/channel?realm=Rooms`);
        
        let rooms = [];
        if (roomsResponse.data.essentialRooms) {
            rooms = roomsResponse.data.essentialRooms;
        } else if (roomsResponse.data.rooms) {
            rooms = roomsResponse.data.rooms;
        } else if (Array.isArray(roomsResponse.data)) {
            rooms = roomsResponse.data;
        }
        
        // Group rooms by location
        const locationMap = {};
        
        rooms.forEach(room => {
            const location = room.location || 'Unknown';
            
            if (!locationMap[location]) {
                locationMap[location] = {
                    name: location,
                    totalRooms: 0,
                    availableRooms: 0,
                    totalDevices: 0,
                    onlineDevices: 0
                };
            }
            
            locationMap[location].totalRooms++;
            if (room.available || room.online) locationMap[location].availableRooms++;
            
            if (room.devices && Array.isArray(room.devices)) {
                locationMap[location].totalDevices += room.devices.length;
                locationMap[location].onlineDevices += room.devices.filter(d => d.online).length;
            }
        });
        
        res.json({
            success: true,
            count: Object.keys(locationMap).length,
            data: Object.values(locationMap)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: err.message || 'Internal server error'
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(70));
    console.log('🚀 AV MONITORING SYSTEM - BACKEND API');
    console.log('='.repeat(70));
    console.log(`📡 Server:       http://localhost:${PORT}`);
    console.log(`🧪 Test:         http://localhost:${PORT}/api/test-inventory`);
    console.log(`📊 Rooms:        http://localhost:${PORT}/api/rooms`);
    console.log(`📈 Room Stats:   http://localhost:${PORT}/api/rooms/stats`);
    console.log(`🖥️  Devices:      http://localhost:${PORT}/api/devices`);
    console.log(`📊 Device Stats: http://localhost:${PORT}/api/devices/stats`);
    console.log(`🔔 Alerts:       http://localhost:${PORT}/api/alerts`);
    console.log(`🌍 Locations:    http://localhost:${PORT}/api/locations`);
    console.log('='.repeat(70));
    console.log(`🔑 Org ID: ${process.env.LOGITECH_ORG_ID.substring(0, 20)}...`);
    console.log('='.repeat(70) + '\n');
    console.log('💡 If you get 401 errors, the token has expired.');
    console.log('   Follow the instructions in the console to refresh it.\n');
});