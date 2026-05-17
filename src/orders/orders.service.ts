import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async getMyOrders(userId: string, role: string) {
    if (role === 'CUSTOMER') {
      return this.prisma.order.findMany({
        where: { customerId: userId },
        include: { provider: { include: { user: true } } },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      const provider = await this.prisma.provider.findUnique({
        where: { userId },
      });
      if (!provider) return [];
      return this.prisma.order.findMany({
        where: { providerId: provider.id },
        include: { customer: true },
        orderBy: { createdAt: 'desc' },
      });
    }
  }

  async createOrder(
    customerId: string,
    data: {
      service_type: string;
      complexity_level: string;
      urgency_level: string;
      provider_id: string;
      scheduled_at?: string;
      service_description?: string;
      baseFee?: number;
      distanceFee?: number;
      urgencyFee?: number;
      complexityFee?: number;
      discount?: number;
      totalAmount?: number;
    },
  ) {
    return this.prisma.order.create({
      data: {
        customerId,
        providerId: data.provider_id,
        serviceType: data.service_type,
        complexityLevel: data.complexity_level as any,
        urgencyLevel: data.urgency_level as any,
        serviceDescription: data.service_description,
        scheduledAt: data.scheduled_at ? new Date(data.scheduled_at) : null,
        baseFee: data.baseFee,
        distanceFee: data.distanceFee,
        urgencyFee: data.urgencyFee,
        complexityFee: data.complexityFee,
        discount: data.discount,
        totalAmount: data.totalAmount,
        orderStatus: 'PENDING',
      },
      include: { provider: { include: { user: true } } },
    });
  }

  async updateStatus(orderId: string, status: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { provider: true },
    });

    if (!order) throw new NotFoundException('Order not found');

    // Security: only customer or assigned provider can update
    const isCustomer = order.customerId === userId;
    const isProvider = order.provider?.userId === userId;
    if (!isCustomer && !isProvider) {
      throw new ForbiddenException('Not authorized');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { orderStatus: status as any },
    });
  }

  async raiseDispute(
    orderId: string,
    userId: string,
    data: { reason: string; description?: string },
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.customerId !== userId) throw new ForbiddenException();

    return this.prisma.dispute.create({
      data: {
        orderId,
        reason: data.reason,
        description: data.description,
        status: 'OPEN',
      },
    });
  }

  async getOrderById(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        provider: { include: { user: true } },
        aiLogs: true,
        disputes: true,
      },
    });
  }
}
