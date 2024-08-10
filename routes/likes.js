const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get likes for a post
router.get('/:postId', async (req, res) => {
    const postId = parseInt(req.params.postId, 10);
    try {
        const result = await pool.query('SELECT * FROM likes WHERE post_id = $1', [postId]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Add a like
router.post('/', async (req, res) => {
    const { post_id, user_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO likes (post_id, user_id) VALUES ($1, $2) RETURNING *',
            [post_id, user_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Remove a like (unlike a post)
router.delete('/:userId/:postId', async (req, res) => {
    const { userId, postId } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM likes WHERE post_id = $1 AND user_id = $2 RETURNING *',
            [postId, userId]
        );
        if (result.rowCount === 0) {
            return res.status(404).send('Like not found');
        }
        res.status(200).json({ message: 'Like removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
