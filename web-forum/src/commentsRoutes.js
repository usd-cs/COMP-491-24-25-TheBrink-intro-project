const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Replace with your database connection details
const pool = new Pool({
  user: 'your_user',
  host: 'localhost',
  database: 'forum_project',
  password: 'your_password',
  port: 5432,
});

// Add a new comment to a post
router.post('/api/posts/:postId/comments', async (req, res) => {
  const { postId } = req.params;
  const { user_id, content } = req.body;

  if (!content || !user_id) {
    return res.status(400).json({ error: 'user_id and content are required.' });
  }

  try {
    const query = `
      INSERT INTO comments (post_id, user_id, content)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [postId, user_id, content];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding comment.' });
  }
});

// Fetch comments for a specific post
router.get('/api/posts/:postId/comments', async (req, res) => {
  const { postId } = req.params;

  try {
    const query = `SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at ASC;`;
    const result = await pool.query(query, [postId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching comments.' });
  }
});

module.exports = router;
