import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProvidersService {
  constructor(private prisma: PrismaService) {}

  async getSettings(userId: string) {
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

  async getDashboardStats(userId: string) {
    const provider = await this.prisma.provider.findUnique({
      where: { userId },
    });
    if (!provider) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completedOrders = await this.prisma.order.findMany({
      where: {
        providerId: provider.id,
        orderStatus: 'COMPLETED',
      },
    });

    const todaysCompletedOrders = completedOrders.filter(
      (o) => o.updatedAt >= today,
    );
    const todaysEarnings = todaysCompletedOrders.reduce(
      (sum, o) => sum + (o.totalAmount || 0),
      0,
    );

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

  async getAnalytics(userId: string) {
    const provider = await this.prisma.provider.findUnique({
      where: { userId },
    });
    if (!provider) return null;

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

    const weeklyEarnings = completedOrders.reduce(
      (sum, o) => sum + (o.totalAmount || 0),
      0,
    );

    // Group earnings by day
    const dailyEarnings: { [key: string]: number } = {
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
      satisfactionRate: provider.reviewSentimentScore * 20, // Scale 0-5 to 0-100
      reputationScores: {
        reliability: provider.reliabilityScore / 5,
        quality: provider.reviewSentimentScore / 5,
        punctuality: (provider as any).punctualityScore / 5,
        communication: (provider as any).communicationScore / 5,
      },
    };
  }

  async updatePricing(userId: string, data: { minPrice?: number; maxPrice?: number; firstBookingDiscount?: number }) {
    return this.prisma.provider.update({
      where: { userId },
      data,
    });
  }

  async updateSchedules(userId: string, schedules: any[]) {
    const provider = await this.prisma.provider.findUnique({ where: { userId } });
    if (!provider) return null;

    // Simplified: clear and recreate
    await this.prisma.providerSchedule.deleteMany({ where: { providerId: provider.id } });
    return this.prisma.providerSchedule.createMany({
      data: schedules.map(s => ({ ...s, providerId: provider.id })),
    });
  }

  async updateSubServices(userId: string, subServices: any[]) {
    const provider = await this.prisma.provider.findUnique({ where: { userId } });
    if (!provider) return null;

    await this.prisma.providerSubService.deleteMany({ where: { providerId: provider.id } });
    return this.prisma.providerSubService.createMany({
      data: subServices.map(s => ({ ...s, providerId: provider.id })),
    });
  }

  async uploadDocument(userId: string, data: { type: string; url?: string }) {
    const provider = await this.prisma.provider.findUnique({ where: { userId } });
    if (!provider) return null;

    return this.prisma.providerDocument.create({
      data: { ...data, providerId: provider.id },
    });
  }
}
