// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};

// Simple API call function with proper error handling
export const apiCall = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('authToken');

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    console.log('API Call:', { url, method: options.method || 'GET', headers });

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }

      let errorMessage = `API Error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        const errorText = await response.text().catch(() => '');
        errorMessage = errorText || errorMessage;
      }

      console.error('Error Response:', errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Success Response:', data);
    return data;
  } catch (error) {
    if (error.name === 'Error' && error.message.includes('API Error')) {
      throw error;
    }
    console.error('API Call Error:', error);
    if (error.message && !error.message.includes('fetch') && !error.message.includes('Network')) {
      throw error;
    }
    throw new Error('Network error. Please check your connection and try again.');
  }
};

// Auth Services
export const authService = {
  register: async (username, email, password) => {
    return await apiCall('/api/users/register/otp', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  },

  login: async (email, password) => {
    return await apiCall('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  forgotPassword: async (email) => {
    return await apiCall('/api/users/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (token, password) => {
    return await apiCall(`/api/users/reset-password/${token}`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  },

  verifyOtp: async (activationToken, otp) => {
    return await apiCall('/api/users/register/verify', {
      method: 'POST',
      body: JSON.stringify({ activationToken, otp }),
    });
  },

  getProfile: async () => {
    return await apiCall('/api/users/profile', {
      method: 'GET',
    });
  },

  verifyAdmin: async () => {
    return await apiCall('/api/users/verify-admin', {
      method: 'GET',
    });
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
};

// Card Services
export const cardService = {
  getAll: async () => {
    return await apiCall('/api/cards', {
      method: 'GET',
    });
  },

  delete: async (id) => {
    return await apiCall(`/api/cards/${id}`, {
      method: 'DELETE',
    });
  },
  
  create: async (data) => {
    return await apiCall('/api/cards', {
      method: 'POST',
      body: data,
    });
  },

  update: async (id, data) => {
    return await apiCall(`/api/cards/${id}`, {
      method: 'PUT',
      body: data,
    });
  },
};

// Payment Services
export const paymentService = {
  createOrder: async (orderId) => {
    return await apiCall('/api/payments/create', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });
  },

  verifyPayment: async (data) => {
    return await apiCall('/api/payments/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Order Services
export const orderService = {
  create: async (orderData) => {
    return await apiCall('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  createRequest: async (cardId, quantity, notes) => {
    return await apiCall('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ cardId, quantity, notes }),
    });
  },

  getAll: async () => {
    return await apiCall('/api/orders', {
      method: 'GET',
    });
  },

  getMyOrders: async () => {
    return await apiCall('/api/orders/me', {
      method: 'GET',
    });
  },

  getMyRequests: async () => {
    return await apiCall('/api/orders/requests/me', {
      method: 'GET',
    });
  },

  getOrderDetails: async (id) => {
    return await apiCall(`/api/orders/${id}`, {
      method: 'GET',
    });
  },

  getPendingAdmin: async () => {
    return await apiCall('/api/orders/admin/pending', {
      method: 'GET',
    });
  },

  acceptAdmin: async (id) => {
    return await apiCall(`/api/orders/admin/${id}/accept`, {
      method: 'POST',
    });
  },

  rejectAdmin: async (id) => {
    return await apiCall(`/api/orders/admin/${id}/reject`, {
      method: 'POST',
    });
  },
};

// Offer Services
export const offerService = {
  getAll: async () => {
    return await apiCall('/api/offers', {
      method: 'GET',
    });
  },

  getActive: async () => {
    return await apiCall('/api/offers/active', {
      method: 'GET',
    });
  },

  create: async (formData) => {
    return await apiCall('/api/offers', {
      method: 'POST',
      body: formData,
    });
  },

  delete: async (id) => {
    return await apiCall(`/api/offers/${id}`, {
      method: 'DELETE',
    });
  },
};

// Admin Services
export const adminService = {
  getUsers: async () => {
    return await apiCall('/api/admin/users', {
      method: 'GET',
    });
  },

  getOrders: async () => {
    return await apiCall('/api/admin/orders', {
      method: 'GET',
    });
  },

  updateRole: async (userId, role) => {
    return await apiCall(`/api/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  },

  deleteUser: async (userId) => {
    return await apiCall(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },
};

// Settings Services
export const settingsService = {
  getAll: async () => {
    return await apiCall('/api/settings', {
      method: 'GET',
    });
  },

  getSection: async (section) => {
    return await apiCall(`/api/settings/${section}`, {
      method: 'GET',
    });
  },

  updateSection: async (section, formData) => {
    return await apiCall(`/api/settings/${section}`, {
      method: 'POST',
      body: formData,
    });
  },
};

// Helper exports
export const getAuthToken = () => localStorage.getItem('authToken');
export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
export const setStoredUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};
