# AV Monitoring Dashboard - Frontend

A React-based dashboard for monitoring Logitech Sync room data and device status.

## Features

- **Real-time Room Monitoring**: Displays room availability and status
- **Room Statistics**: Shows availability percentage and counts
- **Device Management**: View devices in each room with their status
- **Auto-refresh**: Updates every 30 seconds
- **Responsive Design**: Works on desktop and mobile devices

## Components

### RoomsDashboard
Main dashboard component that orchestrates all other components and handles data fetching.

### RoomStatsCard
Displays room availability statistics including:
- Total rooms count
- Available rooms count
- Occupied rooms count
- Availability percentage with progress bar

### RoomsList
Shows a list of all rooms with:
- Room name and location
- Availability status (available/occupied)
- Device count
- Last activity timestamp
- Click to view room details

### RoomDetail
Detailed view of a single room showing:
- Room information
- Device list with status
- Device types (camera, display, etc.)
- Last activity information

## API Integration

The dashboard connects to the backend API at `http://localhost:5000/api` with these endpoints:

- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/stats` - Get room statistics
- `GET /api/rooms/:roomId` - Get single room details
- `GET /api/rooms/:roomId/activity` - Get room activity

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Make sure your backend is running on `http://localhost:5000`

## Tech Stack

- React 19 with functional components and hooks
- Axios for API communication
- Tailwind CSS for styling
- Vite for build tooling

## Data Structure

The dashboard expects the following data structure from the backend:

```javascript
// Room stats
{
  total: 30,
  available: 20,
  unavailable: 10,
  percentage: 70
}

// Room list
{
  data: [
    {
      id: "room-123",
      name: "Conference Room A",
      location: "Melbourne, AUS",
      status: "available",
      deviceCount: 5,
      lastActivity: "2024-01-20T10:30:00Z",
      devices: [...]
    }
  ]
}
```