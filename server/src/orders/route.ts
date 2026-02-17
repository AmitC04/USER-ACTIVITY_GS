import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiHandler } from '@/lib/api-handler';
import { ValidationSchemas, validateInput } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return ApiHandler.badRequest('User ID is required');
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            course: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return ApiHandler.success(orders, 'Orders retrieved successfully');
  } catch (error) {
    return await ApiHandler.handleError(error, 'Failed to fetch orders');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateInput(ValidationSchemas.createOrder, body);

    if (!validation.success) {
      return ApiHandler.badRequest('Invalid input', validation.errors);
    }

    const { items, paymentMethod } = validation.data as any;
    const userId = body.userId as string;

    if (!userId) {
      return ApiHandler.badRequest('User ID is required');
    }

    // Calculate total
    const totalAmount = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        orderNumber,
        totalAmount,
        paymentMethod,
        status: 'completed',
        items: {
          create: items.map((item: any) => ({
            courseId: item.courseId,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            course: true,
          },
        },
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        userId,
        type: 'order_placed',
        description: `Purchase completed - Order ${orderNumber} (₹${totalAmount})`,
      },
    });

    return ApiHandler.success(order, 'Order created successfully', 201);
  } catch (error) {
    return await ApiHandler.handleError(error, 'Failed to create order');
  }
}
