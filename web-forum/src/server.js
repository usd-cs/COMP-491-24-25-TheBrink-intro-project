require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// Configure CORS to allow requests from http://localhost:3000
app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(bodyParser.json());

// PostgreSQL pool configuration
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Define route to handle post insertion
app.post('/api/posts', async (req, res) => {
    const { user_id, content } = req.body;
    try {
        await pool.query(
            'INSERT INTO posts (user_id, content) VALUES ($1, $2)',
            [user_id, content]
        );
        res.status(201).send('Post created successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating post');
    }
});

// Define route to retrieve all posts
app.get('/api/posts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving posts');
    }
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
