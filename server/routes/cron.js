const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// Test Route
router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Cron Route Working"
    });
});

// Update Event Status
router.get("/update-status", async (req, res) => {

    try {

        const now = new Date();

        const result = await Event.updateMany(
            {
                date: { $lt: now }
            },
            {
                $set: {
                    status: "Completed"
                }
            }
        );

        res.json({
            success: true,
            message: "Event status updated successfully",
            modifiedCount: result.modifiedCount
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});

module.exports = router;