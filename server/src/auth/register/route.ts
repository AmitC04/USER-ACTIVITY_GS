import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiHandler } from '@/lib/api-handler';
import { ValidationSchemas, validateInput } from '@/lib/validation';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateInput(ValidationSchemas.register, body);

    if (!validation.success) {
      return ApiHandler.badRequest('Invalid input', validation.errors);
    }

    const { name, email, password } = validation.data as { name: string; email: string; password: string };

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return ApiHandler.badRequest('User with this email already exists', {
        email: ['Email is already registered'],
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

    return ApiHandler.success(user, 'User registered successfully', 201);
  } catch (error) {
    return await ApiHandler.handleError(error, 'Failed to register user');
  }
}
