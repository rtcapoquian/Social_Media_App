const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Get comments for a post
router.get("/:postId", async (req, res) => {
  const postId = parseInt(req.params.postId, 10);
  try {
    const result = await pool.query(
      "SELECT * FROM comments WHERE post_id = $1",
      [postId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Add a comment
router.post("/", async (req, res) => {
  const { post_id, user_id, content } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *",
      [post_id, user_id, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
