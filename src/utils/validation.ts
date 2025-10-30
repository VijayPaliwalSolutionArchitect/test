/**
 * Validation Utilities
 */

export const Validation = {
  // Email validation
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Phone validation (Indian format)
  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  },

  // Password strength
  isStrongPassword: (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  },

  // Required field
  isRequired: (value: any): boolean => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  },

  // Min length
  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },

  // Max length
  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },

  // Numeric only
  isNumeric: (value: string): boolean => {
    return /^\d+$/.test(value);
  },

  // Alpha only
  isAlpha: (value: string): boolean => {
    return /^[a-zA-Z]+$/.test(value);
  },

  // Alphanumeric
  isAlphanumeric: (value: string): boolean => {
    return /^[a-zA-Z0-9]+$/.test(value);
  },

  // URL validation
  isValidUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Date validation
  isValidDate: (date: string): boolean => {
    const dateObj = new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj.getTime());
  },

  // Age validation (for students)
  isValidAge: (dateOfBirth: string, minAge: number = 5, maxAge: number = 25): boolean => {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      return age - 1 >= minAge && age - 1 <= maxAge;
    }
    
    return age >= minAge && age <= maxAge;
  },

  // Roll number format
  isValidRollNumber: (rollNumber: string): boolean => {
    // Format: Class-Section-Number (e.g., 10-A-001)
    return /^\d{1,2}-[A-Z]-\d{3}$/.test(rollNumber);
  },

  // Employee ID format
  isValidEmployeeId: (employeeId: string): boolean => {
    // Format: EMP-XXXXX
    return /^EMP-\d{5}$/.test(employeeId);
  },
};

export default Validation;
