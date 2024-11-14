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
const bcrypt = require('bcrypt');

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

// Route for user login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }
  
    try {
      // Fetch the user with the provided username
      const query = 'SELECT * FROM users WHERE username = $1';
      const values = [username];
      const result = await pool.query(query, values);
  
      if (result.rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Invalid username or password.' });
      }
  
      const user = result.rows[0];
  
      // Compare the input password with the stored hash
      const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordMatch) {
        return res.status(401).json({ success: false, message: 'Invalid username or password.' });
      }
  
      // Successful login
      res.status(200).json({
        success: true,
        username: user.username,
        userType: user.user_type, // "admin", "user", or "guest"
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ success: false, message: 'Error during login. Please try again later.' });
    }
  });

// Route to create a post
app.post('/api/posts', async (req, res) => {
  const { user_id, content, userType } = req.body;

  if (!user_id || !content) {
    return res.status(400).json({ error: 'User ID and content are required.' });
  }

  if (userType !== 'admin' && userType !== 'user') {
    return res.status(403).json({ error: 'Only logged-in users can create posts.' });
  }

  try {
    await pool.query('INSERT INTO posts (user_id, content) VALUES ($1, $2)', [user_id, content]);
    res.status(201).send('Post created successfully');
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).send('Error creating post');
  }
});

// Route to delete a post
app.delete('/api/posts/:postId', async (req, res) => {
  const { postId } = req.params;
  const { userType } = req.body;

  if (userType !== 'admin') {
    return res.status(403).json({ error: 'Only admins can delete posts.' });
  }

  try {
    await pool.query('DELETE FROM posts WHERE id = $1', [postId]);
    res.status(200).send('Post deleted successfully');
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).send('Error deleting post');
  }
});

// Route to add a comment
app.post('/api/posts/:postId/comments', async (req, res) => {
  const { postId } = req.params;
  const { user_id, content, userType } = req.body;

  if (!postId || !user_id || !content) {
    return res.status(400).json({ error: 'Post ID, User ID, and content are required.' });
  }

  if (userType !== 'admin' && userType !== 'user') {
    return res.status(403).json({ error: 'Only logged-in users can add comments.' });
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

// Route to fetch comments for a post
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

// Route to fetch posts
app.get('/api/posts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send('Error retrieving posts');
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
