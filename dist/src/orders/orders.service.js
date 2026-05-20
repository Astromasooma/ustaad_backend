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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMyOrders(userId, role) {
        if (role === 'CUSTOMER') {
            return this.prisma.order.findMany({
                where: { customerId: userId },
                include: { provider: { include: { user: true } } },
                orderBy: { createdAt: 'desc' },
            });
        }
        else {
            const provider = await this.prisma.provider.findUnique({
                where: { userId },
            });
            if (!provider)
                return [];
            return this.prisma.order.findMany({
                where: { providerId: provider.id },
                include: { customer: true },
                orderBy: { createdAt: 'desc' },
            });
        }
    }
    async createOrder(customerId, data) {
        return this.prisma.order.create({
            data: {
                customerId,
                providerId: data.provider_id,
                serviceType: data.service_type,
                complexityLevel: data.complexity_level,
                urgencyLevel: data.urgency_level,
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
    async updateStatus(orderId, status, userId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { provider: true },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        const isCustomer = order.customerId === userId;
        const isProvider = order.provider?.userId === userId;
        if (!isCustomer && !isProvider) {
            throw new common_1.ForbiddenException('Not authorized');
        }
        return this.prisma.order.update({
            where: { id: orderId },
            data: { orderStatus: status },
        });
    }
    async raiseDispute(orderId, userId, data) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.customerId !== userId)
            throw new common_1.ForbiddenException();
        return this.prisma.dispute.create({
            data: {
                orderId,
                reason: data.reason,
                description: data.description,
                status: 'OPEN',
            },
        });
    }
    async getOrderById(orderId) {
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
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map