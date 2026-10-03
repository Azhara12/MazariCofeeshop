import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Request Interceptor: Attach JWT Token correctly
API.interceptors.request.use(
  (config) => {
    let token = null;

    // Primary source: userInfo object (set by AuthContext on login/register)
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        if (parsed && typeof parsed === 'object' && parsed.token) {
          token = parsed.token;
        }
      } catch (e) {
        console.warn('[API] Failed to parse userInfo from localStorage', e);
      }
    }

    // Fallback: plain 'token' key (legacy support)
    if (!token) {
      const rawToken = localStorage.getItem('token');
      if (rawToken) {
        try {
          const parsed = JSON.parse(rawToken);
          token = typeof parsed === 'string' ? parsed : rawToken;
        } catch {
          token = rawToken;
        }
      }
    }

    if (token && typeof token === 'string') {
      const cleanToken = token.replace(/^"|"$/g, '');
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── PRODUCT API ─────────────────────────────────────────────────────────────
export const productAPI = {
  getProducts: (keyword = '', category = 'All', sort = 'createdAt', order = 'desc') => 
    API.get(`/products?keyword=${keyword}&category=${category}&sort=${sort}&order=${order}`),
  getProductById: (id) => API.get(`/products/${id}`),
};

// ─── ORDER API ───────────────────────────────────────────────────────────────
export const orderAPI = {
  createPaymentIntent: (amount) => API.post('/orders/create-payment-intent', { amount }),
  createOrder: (orderData) => API.post('/orders', orderData),
  getMyOrders: () => API.get('/orders/myorders'),
  getOrderById: (id) => API.get(`/orders/${id}`),
};

// ─── USER API ────────────────────────────────────────────────────────────────
export const userAPI = {
  login: (email, password) => API.post('/users/login', { email, password }),
  register: (name, email, password) => API.post('/users/register', { name, email, password }),
};

// ─── AUTH API ────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (email, password) => API.post('/auth/login', { email, password }),
  register: (name, email, password) => API.post('/auth/register', { name, email, password }),
  sendOtp: (email) => API.post('/auth/send-otp', { email }),
  resetPasswordOtp: (email, otp, newPassword) =>
    API.post('/auth/reset-password-otp', { email, otp, newPassword }),
};

// ─── CONTACT API ─────────────────────────────────────────────────────────────
export const contactAPI = {
  submitContact: (contactData) => API.post('/contact', contactData),
};

// ─── ADMIN API (With Full User & Order Management Integration) ─────────────────
export const adminAPI = {
  // Orders endpoints
  getOrders: () => API.get('/orders'), // Matches backend route: GET /api/orders
  updateOrderStatus: (id, orderStatus) => API.patch(`/orders/${id}/status`, { orderStatus }),
  getStats: () => API.get('/admin/stats'),

  // Users management endpoints
  getUsers: () => API.get('/users'),
  toggleUserRole: (id) => API.patch(`/users/${id}/role`),
  deleteUser: (id) => API.delete(`/users/${id}`),

  // Settings management endpoints
  getSettings: () => API.get('/admin/settings'),
  updateSettings: (settingsData) => API.put('/admin/settings', settingsData),
};

export default API;