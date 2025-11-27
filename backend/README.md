# AetherLearn Backend

Flask + MySQL backend for AetherLearn platform.

## Prerequisites

1. **Python 3.10+** installed
2. **MySQL 8.0+** installed and running

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure MySQL

Make sure MySQL is running, then edit `.env` file:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password  # <-- Update this!
DB_NAME=aetherlearn
```

### 3. Initialize Database

The database will be created automatically when you run the app.

Or manually run the SQL script:
```bash
mysql -u root -p < setup_db.sql
```

### 4. Run the Server

```bash
python app.py
```

Server will start at: `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (requires token) |

### Progress

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/progress` | Get all user progress |
| POST | `/api/progress/lecture` | Update lecture progress |

### Quiz & Tests

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/quiz/submit` | Submit quiz score |
| POST | `/api/test/submit` | Submit test answers |

### Leaderboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leaderboard` | Get class leaderboard |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check API status |

## Authentication

Use JWT tokens. Include in headers:
```
Authorization: Bearer <your_token>
```

## Test Credentials

After running `setup_db.sql`:
- **Roll Number:** 101
- **Class ID:** CLASS-8A
- **Password:** password123
