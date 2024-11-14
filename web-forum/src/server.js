require('dotenv').config();
console.log('Loaded Environment Variables:', {
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
});

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// Configure CORS to allow requests from http://localhost:3000
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

app.use(bodyParser.json());

// PostgreSQL pool configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD), // Ensure password is treated as a string
  port: process.env.DB_PORT,
});

// Test database connection
(async () => {
  try {
    const client = await pool.connect();
    console.log('Database connected successfully');
    client.release();
  } catch (err) {
    console.error('Database connection failed:', err);
  }
})();

// Define routes
app.post('/api/posts', async (req, res) => {
  const { user_id, content } = req.body;
  try {
    await pool.query('INSERT INTO posts (user_id, content) VALUES ($1, $2)', [
      user_id,
      content,
    ]);
    res.status(201).send('Post created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating post');
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving posts');
  }
});

app.post('/api/posts/:postId/comments', async (req, res) => {
  console.log('Request params:', req.params);
  console.log('Request body:', req.body);

  const { postId } = req.params;
  const { user_id, content } = req.body;

  if (!postId || !user_id || !content) {
    return res.status(400).json({ error: 'postId, user_id, and content are required.' });
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
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Error adding comment to the database.' });
  }
});

app.get('/api/posts/:postId/comments', async (req, res) => {
  const { postId } = req.params;

  try {
    const query = 'SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at ASC;';
    const result = await pool.query(query, [postId]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Error fetching comments from the database.' });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
