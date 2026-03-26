// Simple performance optimization utilities for browser

class SimplePerformanceManager {
  constructor() {
    this.cleanupInterval = 5 * 60 * 1000; // 5 minutes
    this.maxLocalStorageSize = 5 * 1024 * 1024; // 5MB
    this.init();
  }

  init() {
    // Run cleanup on initialization
    this.cleanupLocalStorage();
    
    // Set up periodic cleanup
    setInterval(() => {
      this.cleanupLocalStorage();
    }, this.cleanupInterval);

    // Run cleanup when page becomes visible again
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.cleanupLocalStorage();
      }
    });

    // Run cleanup before page unload
    window.addEventListener('beforeunload', () => {
      this.cleanupLocalStorage();
    });
  }

  // Clean up localStorage to remove unwanted data
  cleanupLocalStorage() {
    try {
      const keysToRemove = [];
      const currentTime = Date.now();
      
      // Iterate through all localStorage keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;

        // Remove expired session data
        if (key.startsWith('session_') || key.startsWith('temp_')) {
          const data = localStorage.getItem(key);
          if (data) {
            try {
              const parsed = JSON.parse(data);
              if (parsed.expiry && parsed.expiry < currentTime) {
                keysToRemove.push(key);
              }
            } catch (e) {
              // Remove invalid JSON data
              keysToRemove.push(key);
            }
          }
        }

        // Remove old cache data (older than 24 hours)
        if (key.startsWith('cache_')) {
          const data = localStorage.getItem(key);
          if (data) {
            try {
              const parsed = JSON.parse(data);
              if (parsed.timestamp && (currentTime - parsed.timestamp) > 24 * 60 * 60 * 1000) {
                keysToRemove.push(key);
              }
            } catch (e) {
              keysToRemove.push(key);
            }
          }
        }

        // Remove very large items that might cause performance issues
        try {
          const value = localStorage.getItem(key);
          if (value && value.length > 100000) { // 100KB
            console.warn(`Large localStorage item detected: ${key} (${value.length} bytes)`);
            // Keep only essential large items
            if (!key.includes('authToken') && !key.includes('user') && !key.includes('theme')) {
              keysToRemove.push(key);
            }
          }
        } catch (e) {
          console.error(`Error reading localStorage key ${key}:`, e);
          keysToRemove.push(key);
        }
      }

      // Remove identified keys
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
          console.log(`Cleaned up localStorage key: ${key}`);
        } catch (e) {
          console.error(`Error removing localStorage key ${key}:`, e);
        }
      });

      // Check total localStorage size and clean if necessary
      this.checkLocalStorageSize();

      console.log(`LocalStorage cleanup completed. Removed ${keysToRemove.length} items.`);
    } catch (error) {
      console.error('Error during localStorage cleanup:', error);
    }
  }

  // Check and manage localStorage size
  checkLocalStorageSize() {
    try {
      let totalSize = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += localStorage[key].length + key.length;
        }
      }

      // If localStorage is getting full, remove non-essential items
      if (totalSize > this.maxLocalStorageSize) {
        console.warn(`LocalStorage size: ${totalSize} bytes (limit: ${this.maxLocalStorageSize} bytes)`);
        
        // Remove non-essential items, keeping only critical ones
        const essentialKeys = ['authToken', 'user', 'theme', 'wishlist'];
        const keysToRemove = [];

        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && !essentialKeys.some(essential => key.includes(essential))) {
            keysToRemove.push(key);
          }
        }

        keysToRemove.forEach(key => {
          localStorage.removeItem(key);
        });

        console.log(`Removed ${keysToRemove.length} non-essential items to free up space.`);
      }
    } catch (error) {
      console.error('Error checking localStorage size:', error);
    }
  }

  // Set temporary data with automatic expiry
  setTempData(key, value, ttlMinutes = 30) {
    try {
      const expiryTime = Date.now() + (ttlMinutes * 60 * 1000);
      const data = {
        value: value,
        expiry: expiryTime,
        timestamp: Date.now()
      };
      localStorage.setItem(`temp_${key}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error setting temporary data:', error);
    }
  }

  // Get temporary data
  getTempData(key) {
    try {
      const data = localStorage.getItem(`temp_${key}`);
      if (!data) return null;

      const parsed = JSON.parse(data);
      if (parsed.expiry < Date.now()) {
        localStorage.removeItem(`temp_${key}`);
        return null;
      }

      return parsed.value;
    } catch (error) {
      console.error('Error getting temporary data:', error);
      return null;
    }
  }

  // Optimize images and media
  optimizeMedia() {
    try {
      // Lazy load images that are not in viewport
      const images = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    } catch (error) {
      console.log('Image optimization not available');
    }
  }

  // Debounce function for performance
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Throttle function for performance
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// Create and export singleton instance
const simplePerformanceManager = new SimplePerformanceManager();

export default simplePerformanceManager;

// Export utility functions
export const { debounce, throttle, setTempData, getTempData, optimizeMedia } = simplePerformanceManager;
