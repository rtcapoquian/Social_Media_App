const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Get all users
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Get a single user by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).send("User not found");
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Add a new user
router.post("/", async (req, res) => {
  const { username, email, hashed_password, profile_picture, bio } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (username, email, hashed_password, profile_picture, bio) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [username, email, hashed_password, profile_picture, bio]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Update an existing user
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email, hashed_password, profile_picture, bio } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET username = $1, email = $2, hashed_password = $3, profile_picture = $4, bio = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [username, email, hashed_password, profile_picture, bio, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("User not found");
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Delete a user
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).send("User not found");
    }
    res.json({ message: "User deleted", deletedUser: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
