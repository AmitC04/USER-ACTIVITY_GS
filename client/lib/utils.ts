/**
 * API Response Helper
 */
export const successResponse = (data: any, message: string = 'Success', statusCode: number = 200) => {
  return {
    success: true,
    message,
    data,
    statusCode,
  };
};

export const errorResponse = (message: string = 'Error', statusCode: number = 400, errors?: any) => {
  return {
    success: false,
    message,
    errors,
    statusCode,
  };
};

/**
 * Error Handler
 */
export const handleApiError = (error: any, defaultMessage: string = 'An error occurred') => {
  console.error('API Error:', error);
  
  if (error.message) {
    return errorResponse(error.message, 500);
  }
  
  return errorResponse(defaultMessage, 500);
};

/**
 * Validation Helpers
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};
