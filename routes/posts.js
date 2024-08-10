const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all posts
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM posts');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Get a single post by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Post not found');
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Add a new post
router.post('/', async (req, res) => {
    const { user_id, content, image_url } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO posts (user_id, content, image_url) VALUES ($1, $2, $3) RETURNING *',
            [user_id, content, image_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Update an existing post
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { user_id, content, image_url } = req.body;
    try {
        const result = await pool.query(
            'UPDATE posts SET user_id = $1, content = $2, image_url = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
            [user_id, content, image_url, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).send('Post not found');
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Delete a post
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Post not found');
        }
        res.json({ message: 'Post deleted', deletedPost: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
