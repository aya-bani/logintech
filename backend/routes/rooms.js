// const express = require('express');
// const router = express.Router();
// const logitechAPI = require('../services/logitechAPI');

// // Get all rooms
// router.get('/', async (req, res) => {
//     try {
//         const rooms = await logitechAPI.getRooms();
//         res.json({
//             success: true,
//             count: rooms.length,
//             data: rooms
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             error: error.message
//         });
//     }
// });

// // Get single room
// router.get('/:id', async (req, res) => {
//     try {
//         const room = await logitechAPI.getRoom(req.params.id);
//         res.json({
//             success: true,
//             data: room
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             error: error.message
//         });
//     }
// });

// // Get room status
// router.get('/:id/status', async (req, res) => {
//     try {
//         const status = await logitechAPI.getRoomStatus(req.params.id);
//         res.json({
//             success: true,
//             data: status
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             error: error.message
//         });
//     }
// });

// // Get room devices
// router.get('/:id/devices', async (req, res) => {
//     try {
//         const devices = await logitechAPI.getRoomDevices(req.params.id);
//         res.json({
//             success: true,
//             count: devices.length,
//             data: devices
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             error: error.message
//         });
//     }
// });

// // Get room events
// router.get('/:id/events', async (req, res) => {
//     try {
//         const events = await logitechAPI.getRoomEvents(req.params.id, req.query);
//         res.json({
//             success: true,
//             count: events.length,
//             data: events
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             error: error.message
//         });
//     }
// });

// module.exports = router;