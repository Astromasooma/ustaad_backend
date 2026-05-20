"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
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
    const customer1 = await prisma.user.create({
        data: {
            name: 'Sara Ahmed',
            phone: '03001234567',
            email: 'sara@example.com',
            password: hashedPassword,
            role: client_1.Role.CUSTOMER,
            theme: client_1.Theme.LIGHT,
            language: client_1.Language.ENGLISH,
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
            role: client_1.Role.CUSTOMER,
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
            role: client_1.Role.PROVIDER,
        },
    });
    const aiUser = await prisma.user.create({
        data: {
            name: 'AI Ustaad',
            phone: '0000000000',
            email: 'ai@ustaad.com',
            password: hashedPassword,
            role: client_1.Role.ADMIN,
        },
    });
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
    await prisma.post.createMany({
        data: [
            {
                userId: customer1.id,
                type: client_1.PostType.REQUEST,
                text: 'Koi acha electrician recommend karo Gulshan mein? Urgent hai!',
                likes: 12,
                comments: 5,
            },
            {
                userId: providerUser1.id,
                type: client_1.PostType.SERVICE,
                text: 'AC service and repair available in Karachi. 10 years experience. Contact now! ❄️',
                likes: 34,
                comments: 8,
            },
            {
                userId: aiUser.id,
                type: client_1.PostType.AI_INSIGHT,
                text: '🔥 High demand for AC technicians in North Nazimabad area. Providers: book your slots now!',
                likes: 20,
                comments: 2,
            },
        ],
    });
    const order1 = await prisma.order.create({
        data: {
            customerId: customer2.id,
            providerId: hassanProvider.id,
            serviceType: 'AC Repair',
            serviceDescription: 'AC not cooling properly',
            orderStatus: client_1.OrderStatus.IN_PROGRESS,
            complexityLevel: client_1.ComplexityLevel.BASIC,
            urgencyLevel: client_1.UrgencyLevel.NORMAL,
            scheduledAt: new Date(),
            totalAmount: 2750,
        },
    });
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
//# sourceMappingURL=seed.js.map