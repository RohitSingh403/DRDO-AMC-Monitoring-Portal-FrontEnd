import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names using clsx and tailwind-merge
 * @param {...any} inputs - Class names or class name objects
 * @returns {string} Combined and deduplicated class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number to a currency string
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (e.g., 'USD', 'EUR')
 * @param {Object} options - Intl.NumberFormat options
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = 'USD', options = {}) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    ...options,
  }).format(amount);
}

/**
 * Truncates text to a specified length and adds an ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text with ellipsis if needed
 */
export function truncate(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Debounces a function
 * @param {Function} func - The function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
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

/**
 * Generates a unique ID
 * @returns {string} A unique ID
 */
export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Deep clones an object
 * @param {Object} obj - The object to clone
 * @returns {Object} A deep clone of the object
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Checks if a value is empty
 * @param {any} value - The value to check
 * @returns {boolean} True if the value is empty
 */
export function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

export default {
  cn,
  formatCurrency,
  truncate,
  debounce,
  generateId,
  deepClone,
  isEmpty,
};
