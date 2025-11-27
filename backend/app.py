from flask import Flask, request, jsonify
from flask_cors import CORS
from database import get_db_connection, init_database
from auth import hash_password, verify_password, generate_token, token_required
from config import Config
import json

app = Flask(__name__)
CORS(app, origins=['http://localhost:5173', 'http://127.0.0.1:5173'])

# ==================== AUTH ROUTES ====================

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user (student or teacher)"""
    data = request.get_json()
    
    user_type = data.get('userType')
    name = data.get('name')
    password = data.get('password')
    
    if not all([user_type, name, password]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if user_type not in ['student', 'teacher']:
        return jsonify({'error': 'Invalid user type'}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = conn.cursor(dictionary=True)
        
        # Hash password
        password_hash = hash_password(password)
        
        if user_type == 'student':
            roll_number = data.get('rollNumber')
            class_id = data.get('classId')
            
            if not all([roll_number, class_id]):
                return jsonify({'error': 'Roll number and class ID required for students'}), 400
            
            # Check if roll number exists
            cursor.execute("SELECT id FROM users WHERE roll_number = %s", (roll_number,))
            if cursor.fetchone():
                return jsonify({'error': 'Roll number already registered'}), 409
            
            cursor.execute("""
                INSERT INTO users (user_type, name, password_hash, roll_number, class_id)
                VALUES (%s, %s, %s, %s, %s)
            """, (user_type, name, password_hash, roll_number, class_id))
            
        else:  # teacher
            email = data.get('email')
            school = data.get('school')
            
            if not email:
                return jsonify({'error': 'Email required for teachers'}), 400
            
            # Check if email exists
            cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
            if cursor.fetchone():
                return jsonify({'error': 'Email already registered'}), 409
            
            cursor.execute("""
                INSERT INTO users (user_type, name, password_hash, email, school)
                VALUES (%s, %s, %s, %s, %s)
            """, (user_type, name, password_hash, email, school))
        
        conn.commit()
        user_id = cursor.lastrowid
        
        # Generate token
        token = generate_token(user_id, user_type, name)
        
        return jsonify({
            'message': 'Registration successful',
            'token': token,
            'user': {
                'id': user_id,
                'userType': user_type,
                'name': name,
                'rollNumber': data.get('rollNumber'),
                'classId': data.get('classId'),
                'email': data.get('email'),
                'school': data.get('school')
            }
        }), 201
        
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login user"""
    data = request.get_json()
    
    user_type = data.get('userType')
    password = data.get('password')
    
    if not all([user_type, password]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = conn.cursor(dictionary=True)
        
        if user_type == 'student':
            roll_number = data.get('rollNumber')
            class_id = data.get('classId')
            
            if not all([roll_number, class_id]):
                return jsonify({'error': 'Roll number and class ID required'}), 400
            
            cursor.execute("""
                SELECT * FROM users 
                WHERE roll_number = %s AND class_id = %s AND user_type = 'student'
            """, (roll_number, class_id))
            
        else:  # teacher
            email = data.get('email')
            
            if not email:
                return jsonify({'error': 'Email required'}), 400
            
            cursor.execute("""
                SELECT * FROM users 
                WHERE email = %s AND user_type = 'teacher'
            """, (email,))
        
        user = cursor.fetchone()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Verify password
        if not verify_password(password, user['password_hash']):
            return jsonify({'error': 'Invalid password'}), 401
        
        # Generate token
        token = generate_token(user['id'], user['user_type'], user['name'])
        
        # Update streak (check last activity)
        cursor.execute("""
            SELECT last_activity_date, streak_days FROM leaderboard WHERE user_id = %s
        """, (user['id'],))
        leaderboard = cursor.fetchone()
        
        from datetime import date
        today = date.today()
        
        if leaderboard:
            last_activity = leaderboard['last_activity_date']
            streak = leaderboard['streak_days']
            
            if last_activity:
                days_diff = (today - last_activity).days
                if days_diff == 1:
                    streak += 1
                elif days_diff > 1:
                    streak = 1
                # If same day, keep streak
            else:
                streak = 1
            
            cursor.execute("""
                UPDATE leaderboard SET last_activity_date = %s, streak_days = %s WHERE user_id = %s
            """, (today, streak, user['id']))
        else:
            cursor.execute("""
                INSERT INTO leaderboard (user_id, last_activity_date, streak_days)
                VALUES (%s, %s, 1)
            """, (user['id'], today))
            streak = 1
        
        conn.commit()
        
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': user['id'],
                'userType': user['user_type'],
                'name': user['name'],
                'rollNumber': user.get('roll_number'),
                'classId': user.get('class_id'),
                'email': user.get('email'),
                'school': user.get('school'),
                'streak': streak
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user():
    """Get current user info"""
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT id, user_type, name, email, roll_number, class_id, school, created_at
            FROM users WHERE id = %s
        """, (request.user_id,))
        
        user = cursor.fetchone()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'id': user['id'],
            'userType': user['user_type'],
            'name': user['name'],
            'email': user['email'],
            'rollNumber': user['roll_number'],
            'classId': user['class_id'],
            'school': user['school']
        }), 200
        
    finally:
        cursor.close()
        conn.close()


# ==================== PROGRESS ROUTES ====================

@app.route('/api/progress/lecture', methods=['POST'])
@token_required
def update_lecture_progress():
    """Update lecture progress"""
    data = request.get_json()
    lecture_id = data.get('lectureId')
    progress_percent = data.get('progressPercent', 0)
    position_seconds = data.get('positionSeconds', 0)
    
    if not lecture_id:
        return jsonify({'error': 'Lecture ID required'}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = conn.cursor()
        completed = progress_percent >= 90
        
        cursor.execute("""
            INSERT INTO lecture_progress (user_id, lecture_id, progress_percent, last_position_seconds, completed, completed_at)
            VALUES (%s, %s, %s, %s, %s, IF(%s, NOW(), NULL))
            ON DUPLICATE KEY UPDATE
                progress_percent = GREATEST(progress_percent, VALUES(progress_percent)),
                last_position_seconds = VALUES(last_position_seconds),
                completed = completed OR VALUES(completed),
                completed_at = IF(VALUES(completed) AND completed_at IS NULL, NOW(), completed_at)
        """, (request.user_id, lecture_id, progress_percent, position_seconds, completed, completed))
        
        # Update leaderboard if completed
        if completed:
            cursor.execute("""
                INSERT INTO leaderboard (user_id, lectures_completed, total_score)
                VALUES (%s, 1, 10)
                ON DUPLICATE KEY UPDATE
                    lectures_completed = lectures_completed + 1,
                    total_score = total_score + 10
            """, (request.user_id,))
        
        conn.commit()
        return jsonify({'message': 'Progress updated', 'completed': completed}), 200
        
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@app.route('/api/progress', methods=['GET'])
@token_required
def get_user_progress():
    """Get all progress for current user"""
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = conn.cursor(dictionary=True)
        
        # Get lecture progress
        cursor.execute("""
            SELECT lecture_id, progress_percent, completed, last_position_seconds
            FROM lecture_progress WHERE user_id = %s
        """, (request.user_id,))
        lectures = cursor.fetchall()
        
        # Get quiz scores
        cursor.execute("""
            SELECT quiz_id, score, total_questions, percentage, passed, attempts
            FROM quiz_scores WHERE user_id = %s
        """, (request.user_id,))
        quizzes = cursor.fetchall()
        
        # Get test results
        cursor.execute("""
            SELECT test_id, ai_score, total_marks, percentage
            FROM test_results WHERE user_id = %s
        """, (request.user_id,))
        tests = cursor.fetchall()
        
        # Get leaderboard stats
        cursor.execute("""
            SELECT total_score, lectures_completed, quizzes_passed, tests_completed, streak_days
            FROM leaderboard WHERE user_id = %s
        """, (request.user_id,))
        stats = cursor.fetchone() or {
            'total_score': 0,
            'lectures_completed': 0,
            'quizzes_passed': 0,
            'tests_completed': 0,
            'streak_days': 0
        }
        
        return jsonify({
            'lectures': lectures,
            'quizzes': quizzes,
            'tests': tests,
            'stats': stats
        }), 200
        
    finally:
        cursor.close()
        conn.close()


# ==================== QUIZ ROUTES ====================

@app.route('/api/quiz/submit', methods=['POST'])
@token_required
def submit_quiz():
    """Submit quiz score"""
    data = request.get_json()
    quiz_id = data.get('quizId')
    score = data.get('score')
    total_questions = data.get('totalQuestions')
    
    if not all([quiz_id, score is not None, total_questions]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = conn.cursor(dictionary=True)
        
        percentage = round((score / total_questions) * 100, 2)
        passed = percentage >= 70
        
        # Check for existing attempt
        cursor.execute("""
            SELECT id, attempts, percentage as best_percentage FROM quiz_scores 
            WHERE user_id = %s AND quiz_id = %s
            ORDER BY percentage DESC LIMIT 1
        """, (request.user_id, quiz_id))
        existing = cursor.fetchone()
        
        attempts = (existing['attempts'] + 1) if existing else 1
        
        cursor.execute("""
            INSERT INTO quiz_scores (user_id, quiz_id, score, total_questions, percentage, passed, attempts)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (request.user_id, quiz_id, score, total_questions, percentage, passed, attempts))
        
        # Update leaderboard
        if passed and (not existing or not existing.get('best_percentage') or existing['best_percentage'] < 70):
            # First time passing
            cursor.execute("""
                INSERT INTO leaderboard (user_id, quizzes_passed, total_score)
                VALUES (%s, 1, %s)
                ON DUPLICATE KEY UPDATE
                    quizzes_passed = quizzes_passed + 1,
                    total_score = total_score + %s
            """, (request.user_id, int(percentage), int(percentage)))
        
        conn.commit()
        
        return jsonify({
            'message': 'Quiz submitted',
            'percentage': percentage,
            'passed': passed,
            'attempts': attempts
        }), 200
        
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()


# ==================== TEST ROUTES ====================

@app.route('/api/test/submit', methods=['POST'])
@token_required
def submit_test():
    """Submit test answers"""
    data = request.get_json()
    test_id = data.get('testId')
    answers = data.get('answers')
    ai_score = data.get('aiScore')
    total_marks = data.get('totalMarks')
    
    if not all([test_id, answers, total_marks]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = conn.cursor()
        
        percentage = round((ai_score / total_marks) * 100, 2) if ai_score else 0
        
        cursor.execute("""
            INSERT INTO test_results (user_id, test_id, answers, ai_score, total_marks, percentage)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (request.user_id, test_id, json.dumps(answers), ai_score, total_marks, percentage))
        
        # Update leaderboard
        cursor.execute("""
            INSERT INTO leaderboard (user_id, tests_completed, total_score)
            VALUES (%s, 1, %s)
            ON DUPLICATE KEY UPDATE
                tests_completed = tests_completed + 1,
                total_score = total_score + %s
        """, (request.user_id, int(percentage), int(percentage)))
        
        conn.commit()
        
        return jsonify({
            'message': 'Test submitted',
            'percentage': percentage
        }), 200
        
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()


# ==================== LEADERBOARD ROUTES ====================

@app.route('/api/leaderboard', methods=['GET'])
@token_required
def get_leaderboard():
    """Get class leaderboard"""
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    try:
        cursor = conn.cursor(dictionary=True)
        
        # Get user's class
        cursor.execute("SELECT class_id FROM users WHERE id = %s", (request.user_id,))
        user = cursor.fetchone()
        class_id = user.get('class_id') if user else None
        
        # Get leaderboard for class (or all if teacher/no class)
        if class_id:
            cursor.execute("""
                SELECT u.id, u.name, l.total_score, l.streak_days,
                       l.lectures_completed, l.quizzes_passed, l.tests_completed
                FROM leaderboard l
                JOIN users u ON l.user_id = u.id
                WHERE u.class_id = %s
                ORDER BY l.total_score DESC
                LIMIT 50
            """, (class_id,))
        else:
            cursor.execute("""
                SELECT u.id, u.name, l.total_score, l.streak_days,
                       l.lectures_completed, l.quizzes_passed, l.tests_completed
                FROM leaderboard l
                JOIN users u ON l.user_id = u.id
                ORDER BY l.total_score DESC
                LIMIT 50
            """)
        
        entries = cursor.fetchall()
        
        # Add rank
        leaderboard = []
        for i, entry in enumerate(entries):
            leaderboard.append({
                'rank': i + 1,
                'userId': entry['id'],
                'name': entry['name'],
                'score': entry['total_score'],
                'streak': entry['streak_days'],
                'isCurrentUser': entry['id'] == request.user_id
            })
        
        return jsonify({'leaderboard': leaderboard}), 200
        
    finally:
        cursor.close()
        conn.close()


# ==================== HEALTH CHECK ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    conn = get_db_connection()
    db_status = 'connected' if conn else 'disconnected'
    if conn:
        conn.close()
    
    return jsonify({
        'status': 'ok',
        'database': db_status
    }), 200


# ==================== MAIN ====================

if __name__ == '__main__':
    print("🚀 Starting AetherLearn Backend...")
    print("📦 Initializing database...")
    init_database()
    print("🌐 Starting Flask server...")
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)
