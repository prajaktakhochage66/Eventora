const Event = require('../models/Event');

// Get All Events
exports.getEvents = async (req, res) => {
    try {
        const filters = {};

        if (req.query.category) {
            filters.category = req.query.category;
        }

        if (req.query.search) {
            filters.title = {
                $regex: req.query.search,
                $options: 'i'
            };
        }

        const events = await Event.find(filters)
            .populate('createdBy', 'name email')
            .sort({ date: 1 });

        res.json(events);

    } catch (error) {
        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};

// =======================
// Search Suggestions
// =======================
exports.searchEvents = async (req, res) => {
    try {

        const query = req.query.q || '';

        if (!query.trim()) {
            return res.json([]);
        }

        const events = await Event.find({
            $or: [
                {
                    title: {
                        $regex: query,
                        $options: 'i'
                    }
                },
                {
                    category: {
                        $regex: query,
                        $options: 'i'
                    }
                },
                {
                    location: {
                        $regex: query,
                        $options: 'i'
                    }
                }
            ]
        })
            .select('_id title image date location category')
            .limit(8);

        res.json(events);

    } catch (error) {

        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });

    }
};

// Get Event By ID
exports.getEventById = async (req, res) => {
    try {

        const event = await Event.findById(req.params.id)
            .populate('createdBy', 'name email');

        if (!event) {
            return res.status(404).json({
                message: 'Event not found'
            });
        }

        res.json(event);

    } catch (error) {

        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });

    }
};

// Create Event
exports.createEvent = async (req, res) => {

    try {

        const {
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            ticketPrice,
            image
        } = req.body;

        const event = await Event.create({

            title,
            description,
            date,
            location,
            category,
            totalSeats,
            availableSeats: totalSeats,
            ticketPrice: ticketPrice || 0,
            image: image || '',
            createdBy: req.user.id

        });

        res.status(201).json(event);

    } catch (error) {

        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });

    }

};

// Update Event
exports.updateEvent = async (req, res) => {

    try {

        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true
            }
        );

        if (!event) {
            return res.status(404).json({
                message: 'Event not found'
            });
        }

        res.json(event);

    } catch (error) {

        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });

    }

};

// Delete Event
exports.deleteEvent = async (req, res) => {

    try {

        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({
                message: 'Event not found'
            });
        }

        res.json({
            message: 'Event deleted successfully'
        });

    } catch (error) {

        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });

    }

};