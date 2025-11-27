-- AetherLearn Database Setup Script
-- Run this in MySQL if you prefer manual setup

CREATE DATABASE IF NOT EXISTS aetherlearn;
USE aetherlearn;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_type ENUM('student', 'teacher') NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    roll_number VARCHAR(50) UNIQUE,
    class_id VARCHAR(50),
    school VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_roll_number (roll_number)
);

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    grade VARCHAR(20) NOT NULL,
    teacher_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Lectures table
CREATE TABLE IF NOT EXISTS lectures (
    id VARCHAR(50) PRIMARY KEY,
    topic VARCHAR(200) NOT NULL,
    subject VARCHAR(100),
    grade VARCHAR(20),
    duration_seconds INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lecture progress table
CREATE TABLE IF NOT EXISTS lecture_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    lecture_id VARCHAR(50) NOT NULL,
    progress_percent INT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    last_position_seconds INT DEFAULT 0,
    completed_at TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_lecture (user_id, lecture_id)
);

-- Quiz scores table
CREATE TABLE IF NOT EXISTS quiz_scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    quiz_id VARCHAR(50) NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    passed BOOLEAN DEFAULT FALSE,
    attempts INT DEFAULT 1,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_quiz (user_id, quiz_id)
);

-- Test results table
CREATE TABLE IF NOT EXISTS test_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    test_id VARCHAR(50) NOT NULL,
    answers JSON NOT NULL,
    ai_score INT,
    total_marks INT NOT NULL,
    percentage DECIMAL(5,2),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_test (user_id, test_id)
);

-- Leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    total_score INT DEFAULT 0,
    lectures_completed INT DEFAULT 0,
    quizzes_passed INT DEFAULT 0,
    tests_completed INT DEFAULT 0,
    streak_days INT DEFAULT 0,
    last_activity_date DATE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    device_info VARCHAR(255),
    is_offline_capable BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample data for testing
-- Password is 'password123' hashed with bcrypt
INSERT INTO users (user_type, name, password_hash, roll_number, class_id) VALUES
('student', 'Test Student', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4cB0mZDxFOhNvqHi', '101', 'CLASS-8A');

INSERT INTO leaderboard (user_id, total_score, lectures_completed, streak_days) VALUES
(1, 100, 2, 3);

SELECT 'Database setup complete!' AS status;
