import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create sample user if not exists
  const sampleUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Sample User',
      email: 'user@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'student',
    },
  });

  console.log(`Sample user created with id: ${sampleUser.id}`);

  const getOrCreateCourse = async (title: string, data: any) => {
    const existing = await prisma.course.findFirst({ where: { title } });
    if (existing) return existing;
    return prisma.course.create({ data: { title, ...data } });
  };

  const courseA = await getOrCreateCourse('Foundations of Product Design', {
    description: 'Learn design systems, UI fundamentals, and collaboration workflows.',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
    duration: 18,
    price: 2999,
    category: 'Design',
    level: 'Beginner',
    isPublished: true,
  });

  const courseB = await getOrCreateCourse('Full-Stack Web with TypeScript', {
    description: 'Build end-to-end apps with Node.js, Prisma, and React.',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
    duration: 24,
    price: 4499,
    category: 'Development',
    level: 'Intermediate',
    isPublished: true,
  });

  const courseC = await getOrCreateCourse('Data Analytics with SQL', {
    description: 'Query, analyze, and visualize business data with SQL.',
    thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400',
    duration: 12,
    price: 1999,
    category: 'Data',
    level: 'Beginner',
    isPublished: true,
  });

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: sampleUser.id, courseId: courseA.id } },
    update: { status: 'active', progress: 45 },
    create: {
      userId: sampleUser.id,
      courseId: courseA.id,
      status: 'active',
      progress: 45,
      enrolledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    },
  });

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: sampleUser.id, courseId: courseB.id } },
    update: { status: 'completed', progress: 100 },
    create: {
      userId: sampleUser.id,
      courseId: courseB.id,
      status: 'completed',
      progress: 100,
      enrolledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40),
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    },
  });

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: sampleUser.id, courseId: courseC.id } },
    update: { status: 'expired', progress: 20 },
    create: {
      userId: sampleUser.id,
      courseId: courseC.id,
      status: 'expired',
      progress: 20,
      enrolledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
      expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    },
  });

  const existingOrder = await prisma.order.findFirst({ where: { orderNumber: 'ORD-SEED-001' } });
  if (!existingOrder) {
    await prisma.order.create({
      data: {
        userId: sampleUser.id,
        orderNumber: 'ORD-SEED-001',
        totalAmount: 7498,
        status: 'completed',
        paymentMethod: 'Card',
        paymentId: 'PAY-SEED-001',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        items: {
          create: [
            { courseId: courseA.id, price: courseA.price, quantity: 1 },
            { courseId: courseC.id, price: courseC.price, quantity: 1 },
          ],
        },
      },
    });
  }

  await prisma.review.upsert({
    where: { userId_courseId: { userId: sampleUser.id, courseId: courseB.id } },
    update: { rating: 5, content: 'Practical and well-structured content.' },
    create: {
      userId: sampleUser.id,
      courseId: courseB.id,
      rating: 5,
      content: 'Practical and well-structured content.',
      status: 'published',
      helpfulCount: 12,
      replyCount: 2,
    },
  });

  await prisma.activity.deleteMany({ where: { userId: sampleUser.id } });
  await prisma.activity.createMany({
    data: [
      {
        userId: sampleUser.id,
        type: 'course_enrolled',
        description: `Enrolled in ${courseA.title}`,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
      },
      {
        userId: sampleUser.id,
        type: 'course_completed',
        description: `Completed ${courseB.title}`,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      },
      {
        userId: sampleUser.id,
        type: 'order_placed',
        description: 'Order placed: ORD-SEED-001 (₹7498)',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      },
      {
        userId: sampleUser.id,
        type: 'review_submitted',
        description: `Submitted a 5-star review for ${courseB.title}`,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
      },
      {
        userId: sampleUser.id,
        type: 'login',
        description: 'Logged in successfully',
        metadata: JSON.stringify({ location: 'Bengaluru, IN', ipAddress: '192.168.1.24', device: 'Windows', isNewDevice: false }),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      },
    ],
  });

  await prisma.session.deleteMany({ where: { userId: sampleUser.id } });
  await prisma.session.createMany({
    data: [
      {
        userId: sampleUser.id,
        device: 'Windows Desktop',
        browser: 'Chrome',
        ipAddress: '192.168.1.24',
        location: 'Bengaluru, IN',
        isActive: true,
        lastActive: new Date(),
      },
      {
        userId: sampleUser.id,
        device: 'iPhone 14',
        browser: 'Safari',
        ipAddress: '10.0.0.18',
        location: 'Mumbai, IN',
        isActive: false,
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 6),
      },
    ],
  });

  console.log('Seed data populated for courses, enrollments, orders, reviews, activities, and sessions.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });