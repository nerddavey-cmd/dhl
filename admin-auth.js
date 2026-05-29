// Admin Authentication Module
// Handles login/logout and session management

const ADMIN_CREDENTIALS = {
  email: 'nerddavey@gmail.com',
  password: 'Admin12345'
};

const SESSION_KEY = 'dhl_admin_session';

// Check if user is authenticated
function isAuthenticated() {
  const session = sessionStorage.getItem(SESSION_KEY);
  return session === 'authenticated';
}

// Login function
function login(email, password) {
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    sessionStorage.setItem(SESSION_KEY, 'authenticated');
    return { success: true, message: 'Login successful' };
  }
  return { success: false, message: 'Invalid email or password' };
}

// Logout function
function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}

// Redirect unauthenticated users
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = 'admin-login.html';
  }
}

// Redirect authenticated users away from login page
function redirectIfAuthenticated() {
  if (isAuthenticated()) {
    window.location.href = 'admin-dashboard.html';
  }
}
