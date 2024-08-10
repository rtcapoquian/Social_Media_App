const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get notifications for a user
router.get('/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    try {
        const result = await pool.query('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Mark notification as read
router.patch('/:notificationId', async (req, res) => {
    const notificationId = parseInt(req.params.notificationId, 10);
    try {
        const result = await pool.query(
            'UPDATE notifications SET read = TRUE WHERE id = $1 RETURNING *',
            [notificationId]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
