// src/db.js
const { Pool } = require('pg');
require('dotenv').config();

// Log the DATABASE_URL to check if it’s loaded correctly
console.log('Database URL:', process.env.DATABASE_URL);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
