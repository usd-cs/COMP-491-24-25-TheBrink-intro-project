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
const jwt = require('jsonwebtoken');

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
  password: String(process.env.DB_PASSWORD),
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

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'
  
    if (!token) {
      return res.status(401).json({ error: 'Token missing or invalid.' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key', (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid token.' });
      }
  
      req.user = user; // Ensure req.user contains username and userType
      next();
    });
  };  

// Route for user login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const query = 'SELECT * FROM users WHERE username = $1';
    const values = [username];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    const token = jwt.sign(
        { user_id: user.user_id, username: user.username, userType: user.user_type },
        process.env.JWT_SECRET || 'your_secret_key',
        { expiresIn: '1h' }
      );      

    res.json({
      success: true,
      username: user.username,
      userType: user.user_type,
      token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// Route to create a post
app.post('/api/posts', authenticateToken, async (req, res) => {
    const { content } = req.body;
  
    if (!content) {
      return res.status(400).json({ error: 'Post content is required.' });
    }
  
    try {
      const query = `
        INSERT INTO posts (user_id, content)
        VALUES ($1, $2)
        RETURNING post_id, content, created_at, user_id;
      `;
      const result = await pool.query(query, [req.user.user_id, content]);
  
      // Add username from the JWT payload
      const post = result.rows[0];
      post.username = req.user.username;
  
      res.status(201).json(post); // Return the post with username
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).send('Error creating post');
    }
  });  
  
app.post('/api/posts/:postId/comments', authenticateToken, async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Comment content is required.' });
  }

  try {
    const query = `
      INSERT INTO comments (post_id, user_id, content)
      VALUES ($1, $2, $3)
      RETURNING comment_id, content, created_at, user_id;
    `;
    const result = await pool.query(query, [postId, req.user.user_id, content]);

    // Add username from the JWT payload
    const comment = result.rows[0];
    comment.username = req.user.username;

    res.status(201).json(comment); // Return the comment with username
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Error adding comment to the database.' });
  }
});




app.delete('/api/posts/:postId', authenticateToken, async (req, res) => {
    const { postId } = req.params;
  
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete posts.' });
    }
  
    try {
      await pool.query('DELETE FROM posts WHERE post_id = $1', [postId]);
      res.status(200).send('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).send('Error deleting post');
    }
  });
  
  app.delete('/api/comments/:commentId', authenticateToken, async (req, res) => {
    const { commentId } = req.params;
  
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete comments.' });
    }
  
    try {
      await pool.query('DELETE FROM comments WHERE comment_id = $1', [commentId]);
      res.status(200).send('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).send('Error deleting comment');
    }
  });  

// Route to fetch posts
app.get('/api/posts', async (req, res) => {
    try {
      const query = `
        SELECT posts.post_id, posts.content, posts.created_at, users.username 
        FROM posts
        INNER JOIN users ON posts.user_id = users.user_id
        ORDER BY posts.created_at DESC;
      `;
      const result = await pool.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).send('Error retrieving posts');
    }
  });
  
// Route to fetch comments for a post
app.get('/api/posts/:postId/comments', async (req, res) => {
    const { postId } = req.params;
  
    try {
      const query = `
        SELECT comments.comment_id, comments.content, comments.created_at, users.username 
        FROM comments
        INNER JOIN users ON comments.user_id = users.user_id
        WHERE comments.post_id = $1
        ORDER BY comments.created_at ASC;
      `;
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
