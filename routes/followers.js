const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Get followers of a user
router.get("/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  try {
    const result = await pool.query(
      "SELECT * FROM followers WHERE followed_id = $1",
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Follow a user
router.post("/", async (req, res) => {
  const { follower_id, followed_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO followers (follower_id, followed_id) VALUES ($1, $2) RETURNING *",
      [follower_id, followed_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
router.delete("/:follower_id/:followed_id", async (req, res) => {
  const { follower_id, followed_id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM followers WHERE follower_id = $1 AND followed_id = $2 RETURNING *",
      [parseInt(follower_id, 10), parseInt(followed_id, 10)]
    );
    if (result.rowCount === 0) {
      return res.status(404).send("Follower not found");
    }
    res.status(200).send("Unfollowed successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
