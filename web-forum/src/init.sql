-- Drop the database if it exists, then create it
DROP DATABASE IF EXISTS forum_project;
CREATE DATABASE forum_project;

-- Connect to the newly created database
\c forum_project

-- Create users table with user_type column
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(10) NOT NULL DEFAULT 'user' -- 'guest', 'user', or 'admin'
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    post_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    comment_id SERIAL PRIMARY KEY,
    post_id INT REFERENCES posts(post_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add a constraint to enforce valid user_type values
ALTER TABLE users
ADD CONSTRAINT chk_user_type CHECK (user_type IN ('guest', 'user', 'admin'));
