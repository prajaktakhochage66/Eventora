const express = require('express');

const router = express.Router();

const {
    getEvents,
    searchEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
} = require('../controllers/eventController');

const { protect, admin } = require('../middleware/auth');

// Public Routes
router.get('/', getEvents);

// Search Suggestions
router.get('/search', searchEvents);

// Event Details
router.get('/:id', getEventById);

// Admin Routes
router.post('/', protect, admin, createEvent);

router.put('/:id', protect, admin, updateEvent);

router.delete('/:id', protect, admin, deleteEvent);

module.exports = router;