import { OrdersService } from './orders.service';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    getMyOrders(req: any): Promise<({
        provider: ({
            user: {
                name: string;
                phone: string;
                password: string;
                role: import(".prisma/client").$Enums.Role;
                email: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            specializationTags: string[];
            reliabilityScore: number;
            cancellationRate: number;
            workloadCapacity: number;
            disputeCount: number;
            reviewSentimentScore: number;
            isAvailable: boolean;
            isVerified: boolean;
            userId: string;
        }) | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        providerId: string | null;
        orderStatus: import(".prisma/client").$Enums.OrderStatus;
        complexityLevel: import(".prisma/client").$Enums.ComplexityLevel;
        urgencyLevel: import(".prisma/client").$Enums.UrgencyLevel;
        serviceType: string;
        serviceDescription: string | null;
        scheduledAt: Date | null;
        aiMatchScore: number | null;
        baseFee: number | null;
        distanceFee: number | null;
        urgencyFee: number | null;
        complexityFee: number | null;
        discount: number | null;
        totalAmount: number | null;
    })[] | ({
        customer: {
            name: string;
            phone: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            email: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        providerId: string | null;
        orderStatus: import(".prisma/client").$Enums.OrderStatus;
        complexityLevel: import(".prisma/client").$Enums.ComplexityLevel;
        urgencyLevel: import(".prisma/client").$Enums.UrgencyLevel;
        serviceType: string;
        serviceDescription: string | null;
        scheduledAt: Date | null;
        aiMatchScore: number | null;
        baseFee: number | null;
        distanceFee: number | null;
        urgencyFee: number | null;
        complexityFee: number | null;
        discount: number | null;
        totalAmount: number | null;
    })[]>;
    getOrder(id: string): Promise<({
        provider: ({
            user: {
                name: string;
                phone: string;
                password: string;
                role: import(".prisma/client").$Enums.Role;
                email: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            specializationTags: string[];
            reliabilityScore: number;
            cancellationRate: number;
            workloadCapacity: number;
            disputeCount: number;
            reviewSentimentScore: number;
            isAvailable: boolean;
            isVerified: boolean;
            userId: string;
        }) | null;
        customer: {
            name: string;
            phone: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            email: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
        aiLogs: {
            id: string;
            createdAt: Date;
            orderId: string;
            intentTrace: import("@prisma/client/runtime/library").JsonValue | null;
            pricingTrace: import("@prisma/client/runtime/library").JsonValue | null;
            schedulingTrace: import("@prisma/client/runtime/library").JsonValue | null;
            disputeTrace: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
        disputes: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            reason: string;
            description: string | null;
            status: import(".prisma/client").$Enums.DisputeStatus;
            aiAnalysis: import("@prisma/client/runtime/library").JsonValue | null;
            resolution: string | null;
            refundAmt: number | null;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        providerId: string | null;
        orderStatus: import(".prisma/client").$Enums.OrderStatus;
        complexityLevel: import(".prisma/client").$Enums.ComplexityLevel;
        urgencyLevel: import(".prisma/client").$Enums.UrgencyLevel;
        serviceType: string;
        serviceDescription: string | null;
        scheduledAt: Date | null;
        aiMatchScore: number | null;
        baseFee: number | null;
        distanceFee: number | null;
        urgencyFee: number | null;
        complexityFee: number | null;
        discount: number | null;
        totalAmount: number | null;
    }) | null>;
    createOrder(body: any, req: any): Promise<{
        provider: ({
            user: {
                name: string;
                phone: string;
                password: string;
                role: import(".prisma/client").$Enums.Role;
                email: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            specializationTags: string[];
            reliabilityScore: number;
            cancellationRate: number;
            workloadCapacity: number;
            disputeCount: number;
            reviewSentimentScore: number;
            isAvailable: boolean;
            isVerified: boolean;
            userId: string;
        }) | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        providerId: string | null;
        orderStatus: import(".prisma/client").$Enums.OrderStatus;
        complexityLevel: import(".prisma/client").$Enums.ComplexityLevel;
        urgencyLevel: import(".prisma/client").$Enums.UrgencyLevel;
        serviceType: string;
        serviceDescription: string | null;
        scheduledAt: Date | null;
        aiMatchScore: number | null;
        baseFee: number | null;
        distanceFee: number | null;
        urgencyFee: number | null;
        complexityFee: number | null;
        discount: number | null;
        totalAmount: number | null;
    }>;
    updateStatus(id: string, status: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        providerId: string | null;
        orderStatus: import(".prisma/client").$Enums.OrderStatus;
        complexityLevel: import(".prisma/client").$Enums.ComplexityLevel;
        urgencyLevel: import(".prisma/client").$Enums.UrgencyLevel;
        serviceType: string;
        serviceDescription: string | null;
        scheduledAt: Date | null;
        aiMatchScore: number | null;
        baseFee: number | null;
        distanceFee: number | null;
        urgencyFee: number | null;
        complexityFee: number | null;
        discount: number | null;
        totalAmount: number | null;
    }>;
    raiseDispute(id: string, body: {
        reason: string;
        description?: string;
    }, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        reason: string;
        description: string | null;
        status: import(".prisma/client").$Enums.DisputeStatus;
        aiAnalysis: import("@prisma/client/runtime/library").JsonValue | null;
        resolution: string | null;
        refundAmt: number | null;
        orderId: string;
    }>;
}
