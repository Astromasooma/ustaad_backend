import { PrismaClient, Role, OrderStatus, ComplexityLevel, UrgencyLevel, PostType, Theme, Language } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data in correct order
  await prisma.providerDocument.deleteMany();
  await prisma.providerSubService.deleteMany();
  await prisma.providerSchedule.deleteMany();
  await prisma.dispute.deleteMany();
  await prisma.aILog.deleteMany();
  await prisma.order.deleteMany();
  await prisma.post.deleteMany();
  await prisma.address.deleteMany();
  await prisma.notificationSettings.deleteMany();
  await prisma.provider.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // --- Seed Users ---
  const customer1 = await prisma.user.create({
    data: {
      name: 'Sara Ahmed',
      phone: '03001234567',
      email: 'sara@example.com',
      password: hashedPassword,
      role: Role.CUSTOMER,
      theme: Theme.LIGHT,
      language: Language.ENGLISH,
      notificationSettings: {
        create: {
          pushEnabled: true,
          smsEnabled: false,
          emailEnabled: true,
        },
      },
      addresses: {
        create: {
          label: 'Home',
          houseFlatNo: 'A-101',
          area: 'Gulshan',
          city: 'Karachi',
          isDefault: true,
        },
      },
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: 'Ahmad Khan',
      phone: '03007654321',
      email: 'ahmad@example.com',
      password: hashedPassword,
      role: Role.CUSTOMER,
      notificationSettings: {
        create: {
          pushEnabled: true,
          smsEnabled: true,
          emailEnabled: false,
        },
      },
      addresses: {
        createMany: {
          data: [
            {
              label: 'Home',
              houseFlatNo: 'B-12',
              area: 'Gulshan-e-Iqbal',
              city: 'Karachi',
              isDefault: true,
            },
            {
              label: 'Work',
              houseFlatNo: 'Office 5',
              area: 'I-8',
              city: 'Islamabad',
            },
          ],
        },
      },
    },
  });

  const providerUser1 = await prisma.user.create({
    data: {
      name: 'Hassan AC Tech',
      phone: '03111234567',
      email: 'hassan@example.com',
      password: hashedPassword,
      role: Role.PROVIDER,
    },
  });

  const aiUser = await prisma.user.create({
    data: {
      name: 'AI Ustaad',
      phone: '0000000000',
      email: 'ai@ustaad.com',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  // --- Seed Providers ---
  const hassanProvider = await prisma.provider.create({
    data: {
      userId: providerUser1.id,
      category: 'AC Technician',
      specializationTags: ['AC Repair', 'Installation', 'Maintenance'],
      reliabilityScore: 4.8,
      isVerified: true,
      minPrice: 800,
      maxPrice: 6000,
      firstBookingDiscount: 15,
      schedules: {
        createMany: {
          data: [
            { dayOfWeek: 'Monday', startTime: '09:00', endTime: '18:00' },
            { dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '18:00' },
            { dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '18:00' },
            { dayOfWeek: 'Thursday', startTime: '09:00', endTime: '18:00' },
            { dayOfWeek: 'Friday', startTime: '09:00', endTime: '17:00' },
          ],
        },
      },
      subServices: {
        createMany: {
          data: [
            { name: 'AC Repair & Servicing', isActive: true },
            { name: 'AC Installation', isActive: true },
            { name: 'Refrigerator Repair', isActive: false },
            { name: 'Washing Machine Repair', isActive: false },
          ],
        },
      },
      documents: {
        createMany: {
          data: [
            { type: 'CNIC', status: 'VERIFIED' },
            { type: 'Trade Certificate', status: 'PENDING' },
          ],
        },
      },
    },
  });

  // --- Seed Posts (Feed) ---
  await prisma.post.createMany({
    data: [
      {
        userId: customer1.id,
        type: PostType.REQUEST,
        text: 'Koi acha electrician recommend karo Gulshan mein? Urgent hai!',
        likes: 12,
        comments: 5,
      },
      {
        userId: providerUser1.id,
        type: PostType.SERVICE,
        text: 'AC service and repair available in Karachi. 10 years experience. Contact now! ❄️',
        likes: 34,
        comments: 8,
      },
      {
        userId: aiUser.id,
        type: PostType.AI_INSIGHT,
        text: '🔥 High demand for AC technicians in North Nazimabad area. Providers: book your slots now!',
        likes: 20,
        comments: 2,
      },
    ],
  });

  // --- Seed Orders (Jobs) ---
  const order1 = await prisma.order.create({
    data: {
      customerId: customer2.id,
      providerId: hassanProvider.id,
      serviceType: 'AC Repair',
      serviceDescription: 'AC not cooling properly',
      orderStatus: OrderStatus.IN_PROGRESS,
      complexityLevel: ComplexityLevel.BASIC,
      urgencyLevel: UrgencyLevel.NORMAL,
      scheduledAt: new Date(),
      totalAmount: 2750,
    },
  });

  // --- Seed AI Logs ---
  await prisma.aILog.create({
    data: {
      orderId: order1.id,
      intentTrace: { intent: 'repair', item: 'AC' },
      pricingTrace: { base: 2000, complexity: 500, distance: 250 },
    },
  });

  console.log('Seed data with settings created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
