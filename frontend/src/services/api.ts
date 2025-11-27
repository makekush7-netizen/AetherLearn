// API Service - Connects frontend to Flask backend

const API_BASE_URL = 'http://localhost:5000/api';

// Get stored token
const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
}

// ==================== AUTH API ====================

export interface RegisterStudentData {
  userType: 'student';
  name: string;
  password: string;
  rollNumber: string;
  classId: string;
}

export interface RegisterTeacherData {
  userType: 'teacher';
  name: string;
  password: string;
  email: string;
  school?: string;
}

export interface LoginStudentData {
  userType: 'student';
  password: string;
  rollNumber: string;
  classId: string;
}

export interface LoginTeacherData {
  userType: 'teacher';
  password: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    userType: 'student' | 'teacher';
    name: string;
    rollNumber?: string;
    classId?: string;
    email?: string;
    school?: string;
    streak?: number;
  };
}

export interface User {
  id: number;
  userType: 'student' | 'teacher';
  name: string;
  rollNumber?: string;
  classId?: string;
  email?: string;
  school?: string;
}

export const authAPI = {
  register: async (data: RegisterStudentData | RegisterTeacherData): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Store token and user info
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('userId', String(response.user.id));
    localStorage.setItem('userType', response.user.userType);
    localStorage.setItem('userName', response.user.name);
    if (response.user.rollNumber) localStorage.setItem('rollNumber', response.user.rollNumber);
    if (response.user.classId) localStorage.setItem('classId', response.user.classId);
    if (response.user.email) localStorage.setItem('userEmail', response.user.email);
    if (response.user.school) localStorage.setItem('school', response.user.school);
    
    return response;
  },

  login: async (data: LoginStudentData | LoginTeacherData): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Store token and user info
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('userId', String(response.user.id));
    localStorage.setItem('userType', response.user.userType);
    localStorage.setItem('userName', response.user.name);
    if (response.user.rollNumber) localStorage.setItem('rollNumber', response.user.rollNumber);
    if (response.user.classId) localStorage.setItem('classId', response.user.classId);
    if (response.user.email) localStorage.setItem('userEmail', response.user.email);
    if (response.user.school) localStorage.setItem('school', response.user.school);
    if (response.user.streak) localStorage.setItem('streak', String(response.user.streak));
    
    return response;
  },

  getCurrentUser: async (): Promise<User> => {
    return apiRequest<User>('/auth/me');
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    localStorage.removeItem('rollNumber');
    localStorage.removeItem('classId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('school');
    localStorage.removeItem('streak');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  },
};

// ==================== PROGRESS API ====================

export interface LectureProgress {
  lecture_id: string;
  progress_percent: number;
  completed: boolean;
  last_position_seconds: number;
}

export interface QuizScore {
  quiz_id: string;
  score: number;
  total_questions: number;
  percentage: number;
  passed: boolean;
  attempts: number;
}

export interface TestResult {
  test_id: string;
  ai_score: number;
  total_marks: number;
  percentage: number;
}

export interface UserStats {
  total_score: number;
  lectures_completed: number;
  quizzes_passed: number;
  tests_completed: number;
  streak_days: number;
}

export interface UserProgress {
  lectures: LectureProgress[];
  quizzes: QuizScore[];
  tests: TestResult[];
  stats: UserStats;
}

export const progressAPI = {
  getProgress: async (): Promise<UserProgress> => {
    return apiRequest<UserProgress>('/progress');
  },

  updateLectureProgress: async (
    lectureId: string,
    progressPercent: number,
    positionSeconds: number
  ): Promise<{ message: string; completed: boolean }> => {
    return apiRequest('/progress/lecture', {
      method: 'POST',
      body: JSON.stringify({
        lectureId,
        progressPercent,
        positionSeconds,
      }),
    });
  },
};

// ==================== QUIZ API ====================

export const quizAPI = {
  submitScore: async (
    quizId: string,
    score: number,
    totalQuestions: number
  ): Promise<{ message: string; percentage: number; passed: boolean; attempts: number }> => {
    return apiRequest('/quiz/submit', {
      method: 'POST',
      body: JSON.stringify({
        quizId,
        score,
        totalQuestions,
      }),
    });
  },
};

// ==================== TEST API ====================

export const testAPI = {
  submitTest: async (
    testId: string,
    answers: Record<string, string>,
    aiScore: number,
    totalMarks: number
  ): Promise<{ message: string; percentage: number }> => {
    return apiRequest('/test/submit', {
      method: 'POST',
      body: JSON.stringify({
        testId,
        answers,
        aiScore,
        totalMarks,
      }),
    });
  },
};

// ==================== LEADERBOARD API ====================

export interface LeaderboardEntry {
  rank: number;
  userId: number;
  name: string;
  score: number;
  streak: number;
  isCurrentUser: boolean;
}

export const leaderboardAPI = {
  getLeaderboard: async (): Promise<{ leaderboard: LeaderboardEntry[] }> => {
    return apiRequest('/leaderboard');
  },
};

// ==================== HEALTH CHECK ====================

export const healthAPI = {
  check: async (): Promise<{ status: string; database: string }> => {
    return apiRequest('/health');
  },
};

// Export all
export default {
  auth: authAPI,
  progress: progressAPI,
  quiz: quizAPI,
  test: testAPI,
  leaderboard: leaderboardAPI,
  health: healthAPI,
};
