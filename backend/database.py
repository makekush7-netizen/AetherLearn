import mysql.connector
from mysql.connector import Error
from config import Config

def get_db_connection():
    """Create and return a database connection"""
    try:
        connection = mysql.connector.connect(
            host=Config.DB_HOST,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            database=Config.DB_NAME
        )
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def init_database():
    """Initialize database and create tables"""
    try:
        # First connect without database to create it
        connection = mysql.connector.connect(
            host=Config.DB_HOST,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD
        )
        cursor = connection.cursor()
        
        # Create database if not exists
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {Config.DB_NAME}")
        cursor.execute(f"USE {Config.DB_NAME}")
        
        # Create users table
        cursor.execute("""
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
            )
        """)
        
        # Create classes table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS classes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                class_id VARCHAR(50) UNIQUE NOT NULL,
                name VARCHAR(100) NOT NULL,
                grade VARCHAR(20) NOT NULL,
                teacher_id INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL
            )
        """)
        
        # Create lectures table (synced from JSON, but can store additional metadata)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS lectures (
                id VARCHAR(50) PRIMARY KEY,
                topic VARCHAR(200) NOT NULL,
                subject VARCHAR(100),
                grade VARCHAR(20),
                duration_seconds INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create lecture_progress table
        cursor.execute("""
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
            )
        """)
        
        # Create quiz_scores table
        cursor.execute("""
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
            )
        """)
        
        # Create test_results table
        cursor.execute("""
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
            )
        """)
        
        # Create leaderboard_cache table (updated periodically)
        cursor.execute("""
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
            )
        """)
        
        # Create sessions table for tracking active sessions
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS sessions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                token_hash VARCHAR(255) NOT NULL,
                device_info VARCHAR(255),
                is_offline_capable BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)
        
        connection.commit()
        print("✅ Database initialized successfully!")
        return True
        
    except Error as e:
        print(f"❌ Error initializing database: {e}")
        return False
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == "__main__":
    init_database()
