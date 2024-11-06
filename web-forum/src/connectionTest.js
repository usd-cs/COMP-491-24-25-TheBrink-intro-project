const pool = require('./db');

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err.stack);
    } else {
        console.log('Connected to database. Current time:', res.rows[0]);
    }
    pool.end();
});
