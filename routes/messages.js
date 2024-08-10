const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get messages between two users
router.get('/:senderId/:receiverId', async (req, res) => {
    const senderId = parseInt(req.params.senderId, 10);
    const receiverId = parseInt(req.params.receiverId, 10);
    try {
        const result = await pool.query(
            'SELECT * FROM messages WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1) ORDER BY created_at ASC',
            [senderId, receiverId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Send a message
router.post('/', async (req, res) => {
    const { sender_id, receiver_id, content } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *',
            [sender_id, receiver_id, content]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
