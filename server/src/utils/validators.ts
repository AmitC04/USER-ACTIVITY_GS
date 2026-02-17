import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors: Record<string, string[]> = {};
    errors.array().forEach((error: any) => {
      if (!formattedErrors[error.path]) {
        formattedErrors[error.path] = [];
      }
      formattedErrors[error.path].push(error.msg);
    });

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
      statusCode: 400,
    });
  }
  next();
};

// Authentication Validators
export const registerValidator = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number'),
];

export const loginValidator = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Course Validators
export const createCourseValidator = [
  body('title').trim().isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  body('description').trim().optional().isLength({ max: 5000 }).withMessage('Description too long'),
  body('thumbnail').optional().isURL().withMessage('Thumbnail must be a valid URL'),
  body('duration').optional().isInt({ min: 1 }).withMessage('Duration must be a positive number'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').optional().trim(),
  body('level').optional().isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid level'),
];

// Enrollment Validators
export const enrollmentValidator = [
  body('courseId').trim().notEmpty().withMessage('Course ID is required'),
  body('expiresAt').optional().isISO8601().withMessage('Invalid expiry date'),
];

// Order Validators
export const createOrderValidator = [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.courseId').notEmpty().withMessage('Course ID is required for each item'),
  body('items.*.price').isFloat({ min: 0 }).withMessage('Price must be positive'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('paymentMethod').isIn(['credit_card', 'debit_card', 'paypal']).withMessage('Invalid payment method'),
];

// Review Validators
export const reviewValidator = [
  body('courseId').trim().notEmpty().withMessage('Course ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().isLength({ min: 10, max: 1000 }).withMessage('Comment must be between 10 and 1000 characters'),
];

// ID Validators
export const idValidator = [
  param('id').trim().notEmpty().withMessage('ID is required'),
];
