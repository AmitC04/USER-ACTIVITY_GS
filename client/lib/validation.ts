import { z } from 'zod';

export const ValidationSchemas = {
  // User Schemas
  register: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters').regex(/[A-Z]/, 'Must contain uppercase').regex(/[0-9]/, 'Must contain number'),
  }),

  login: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),

  updateProfile: z.object({
    name: z.string().min(2).max(50).optional(),
    avatar: z.string().url().optional(),
  }),

  // Course Schemas
  createCourse: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().optional(),
    thumbnail: z.string().url().optional(),
    duration: z.number().positive().optional(),
    price: z.number().positive('Price must be greater than 0'),
  }),

  // Enrollment Schemas
  createEnrollment: z.object({
    courseId: z.string().min(1, 'Course ID is required'),
  }),

  // Review Schemas
  createReview: z.object({
    courseId: z.string().min(1, 'Course ID is required'),
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(10, 'Comment must be at least 10 characters').max(500),
  }),

  // Order Schemas
  createOrder: z.object({
    items: z.array(
      z.object({
        courseId: z.string(),
        price: z.number().positive(),
        quantity: z.number().int().positive(),
      })
    ).min(1, 'At least one item is required'),
    paymentMethod: z.enum(['credit_card', 'debit_card', 'paypal']),
  }),
};

export function validateInput<T>(schema: z.ZodSchema, data: unknown): { success: boolean; data?: T; errors?: Record<string, string[]> } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated as T };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(err.message);
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: ['Validation failed'] } };
  }
}
