"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvidersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProvidersService = class ProvidersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSettings(userId) {
        const provider = await this.prisma.provider.findUnique({
            where: { userId },
            include: {
                schedules: true,
                subServices: true,
                documents: true,
            },
        });
        return provider;
    }
    async getDashboardStats(userId) {
        const provider = await this.prisma.provider.findUnique({
            where: { userId },
        });
        if (!provider)
            return null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const completedOrders = await this.prisma.order.findMany({
            where: {
                providerId: provider.id,
                orderStatus: 'COMPLETED',
            },
        });
        const todaysCompletedOrders = completedOrders.filter((o) => o.updatedAt >= today);
        const todaysEarnings = todaysCompletedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        const pendingJobsCount = await this.prisma.order.count({
            where: {
                providerId: provider.id,
                orderStatus: {
                    in: ['PENDING', 'ACCEPTED', 'SCHEDULED', 'EN_ROUTE', 'IN_PROGRESS'],
                },
            },
        });
        const incomingJobs = await this.prisma.order.findMany({
            where: {
                providerId: provider.id,
                orderStatus: 'PENDING',
            },
            include: {
                customer: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 5,
        });
        return {
            todaysEarnings,
            pendingJobsCount,
            completedJobsCount: completedOrders.length,
            rating: provider.reliabilityScore,
            incomingJobs,
        };
    }
    async getAnalytics(userId) {
        const provider = await this.prisma.provider.findUnique({
            where: { userId },
        });
        if (!provider)
            return null;
        const today = new Date();
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        const completedOrders = await this.prisma.order.findMany({
            where: {
                providerId: provider.id,
                orderStatus: 'COMPLETED',
                updatedAt: { gte: lastWeek },
            },
        });
        const weeklyEarnings = completedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        const dailyEarnings = {
            Mon: 0,
            Tue: 0,
            Wed: 0,
            Thu: 0,
            Fri: 0,
            Sat: 0,
            Sun: 0,
        };
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        completedOrders.forEach((o) => {
            const day = days[o.updatedAt.getDay()];
            dailyEarnings[day] += o.totalAmount || 0;
        });
        const jobsThisMonth = await this.prisma.order.count({
            where: {
                providerId: provider.id,
                orderStatus: 'COMPLETED',
                updatedAt: {
                    gte: new Date(today.getFullYear(), today.getMonth(), 1),
                },
            },
        });
        return {
            weeklyEarnings,
            dailyEarnings,
            jobsThisMonth,
            satisfactionRate: provider.reviewSentimentScore * 20,
            reputationScores: {
                reliability: provider.reliabilityScore / 5,
                quality: provider.reviewSentimentScore / 5,
                punctuality: provider.punctualityScore / 5,
                communication: provider.communicationScore / 5,
            },
        };
    }
    async updatePricing(userId, data) {
        return this.prisma.provider.update({
            where: { userId },
            data,
        });
    }
    async updateSchedules(userId, schedules) {
        const provider = await this.prisma.provider.findUnique({ where: { userId } });
        if (!provider)
            return null;
        await this.prisma.providerSchedule.deleteMany({ where: { providerId: provider.id } });
        return this.prisma.providerSchedule.createMany({
            data: schedules.map(s => ({ ...s, providerId: provider.id })),
        });
    }
    async updateSubServices(userId, subServices) {
        const provider = await this.prisma.provider.findUnique({ where: { userId } });
        if (!provider)
            return null;
        await this.prisma.providerSubService.deleteMany({ where: { providerId: provider.id } });
        return this.prisma.providerSubService.createMany({
            data: subServices.map(s => ({ ...s, providerId: provider.id })),
        });
    }
    async uploadDocument(userId, data) {
        const provider = await this.prisma.provider.findUnique({ where: { userId } });
        if (!provider)
            return null;
        return this.prisma.providerDocument.create({
            data: { ...data, providerId: provider.id },
        });
    }
};
exports.ProvidersService = ProvidersService;
exports.ProvidersService = ProvidersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProvidersService);
//# sourceMappingURL=providers.service.js.map