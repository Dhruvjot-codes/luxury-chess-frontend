// API Configuration
const API_BASE_URL = 'http://localhost:5000';

// Simple API call function with proper error handling
export const apiCall = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('authToken');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    console.log('API Call:', { url, method: options.method || 'GET', headers });
    
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    console.log('Response:', { status: response.status, ok: response.ok });
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      const errorText = await response.text();
      console.error('Error Response:', errorText);
      throw new Error(errorText || `API Error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Success Response:', data);
    return data;
  } catch (error) {
    console.error('API Call Error:', error);
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
};

// Order Services
export const orderService = {
  create: async (orderData) => {
    return await apiCall('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },
  
  // Alias for createRequest as used in Cards.jsx
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
  
  create: async (offerData) => {
    return await apiCall('/api/offers', {
      method: 'POST',
      body: JSON.stringify(offerData),
    });
  },
  
  delete: async (id) => {
    return await apiCall(`/api/offers/${id}`, {
      method: 'DELETE',
    });
  },
};

// Payment Services
export const paymentService = {
  createOrder: async (paymentData) => {
    return await apiCall('/api/payments/create-order', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },
  
  verifyPayment: async (paymentId) => {
    return await apiCall(`/api/payments/verify/${paymentId}`, {
      method: 'GET',
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

// Helper functions
export const getAuthToken = () => localStorage.getItem('authToken');
export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
export const setStoredUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};
