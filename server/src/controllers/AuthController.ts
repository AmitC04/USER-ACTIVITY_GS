import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { ResponseHandler } from '../utils/responseHandler';
import { generateToken } from '../utils/jwt';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return ResponseHandler.badRequest(res, 'Email already registered', {
          email: ['This email is already in use'],
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          role: true,
          createdAt: true,
        },
      });

      // Log activity
      await prisma.activity.create({
        data: {
          userId: user.id,
          type: 'registration',
          description: 'Account created',
        },
      });

      // Generate token
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      return ResponseHandler.success(res, { user, token }, 'User registered successfully', 201);
    } catch (error) {
      console.error('Registration error:', error);
      return ResponseHandler.internalError(res, 'Failed to register user');
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return ResponseHandler.unauthorized(res, 'Invalid credentials');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return ResponseHandler.unauthorized(res, 'Invalid credentials');
      }

      // Create session
      await prisma.session.create({
        data: {
          userId: user.id,
          device: req.headers['user-agent'] || 'Unknown',
          browser: req.headers['user-agent'] || 'Unknown',
          ipAddress: req.ip || 'Unknown',
          location: 'Unknown',
        },
      });

      // Log activity
      await prisma.activity.create({
        data: {
          userId: user.id,
          type: 'login',
          description: 'Logged in successfully',
        },
      });

      // Generate token
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      return ResponseHandler.success(
        res,
        {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
          },
          token,
        },
        'Login successful'
      );
    } catch (error) {
      console.error('Login error:', error);
      return ResponseHandler.internalError(res, 'Failed to login');
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId! },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return ResponseHandler.notFound(res, 'User not found');
      }

      return ResponseHandler.success(res, user, 'Profile retrieved');
    } catch (error) {
      console.error('Get profile error:', error);
      return ResponseHandler.internalError(res, 'Failed to get profile');
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const { name, avatar } = req.body;

      const user = await prisma.user.update({
        where: { id: req.userId! },
        data: {
          ...(name && { name }),
          ...(avatar && { avatar }),
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // Log activity
      await prisma.activity.create({
        data: {
          userId: user.id,
          type: 'profile_updated',
          description: 'Profile information updated',
        },
      });

      return ResponseHandler.success(res, user, 'Profile updated successfully');
    } catch (error) {
      console.error('Update profile error:', error);
      return ResponseHandler.internalError(res, 'Failed to update profile');
    }
  }
}
