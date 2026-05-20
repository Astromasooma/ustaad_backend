import { PrismaService } from '../prisma/prisma.service';
export declare class ProvidersService {
    private prisma;
    constructor(prisma: PrismaService);
    getSettings(userId: string): Promise<({
        schedules: {
            id: string;
            providerId: string;
            dayOfWeek: string;
            startTime: string;
            endTime: string;
            isActive: boolean;
        }[];
        subServices: {
            id: string;
            name: string;
            providerId: string;
            isActive: boolean;
        }[];
        documents: {
            id: string;
            createdAt: Date;
            providerId: string;
            status: string;
            type: string;
            url: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        latitude: number | null;
        longitude: number | null;
        specializationTags: string[];
        category: string | null;
        reliabilityScore: number;
        punctualityScore: number;
        communicationScore: number;
        cancellationRate: number;
        workloadCapacity: number;
        disputeCount: number;
        reviewSentimentScore: number;
        isAvailable: boolean;
        isVerified: boolean;
        minPrice: number | null;
        maxPrice: number | null;
        firstBookingDiscount: number | null;
        userId: string;
    }) | null>;
    getDashboardStats(userId: string): Promise<{
        todaysEarnings: number;
        pendingJobsCount: number;
        completedJobsCount: number;
        rating: number;
        incomingJobs: ({
            customer: {
                id: string;
                role: import(".prisma/client").$Enums.Role;
                name: string;
                phone: string;
                email: string | null;
                password: string;
                theme: import(".prisma/client").$Enums.Theme;
                language: import(".prisma/client").$Enums.Language;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
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
            customerId: string;
            providerId: string | null;
        })[];
    } | null>;
    getAnalytics(userId: string): Promise<{
        weeklyEarnings: number;
        dailyEarnings: {
            [key: string]: number;
        };
        jobsThisMonth: number;
        satisfactionRate: number;
        reputationScores: {
            reliability: number;
            quality: number;
            punctuality: number;
            communication: number;
        };
    } | null>;
    updatePricing(userId: string, data: {
        minPrice?: number;
        maxPrice?: number;
        firstBookingDiscount?: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        latitude: number | null;
        longitude: number | null;
        specializationTags: string[];
        category: string | null;
        reliabilityScore: number;
        punctualityScore: number;
        communicationScore: number;
        cancellationRate: number;
        workloadCapacity: number;
        disputeCount: number;
        reviewSentimentScore: number;
        isAvailable: boolean;
        isVerified: boolean;
        minPrice: number | null;
        maxPrice: number | null;
        firstBookingDiscount: number | null;
        userId: string;
    }>;
    updateSchedules(userId: string, schedules: any[]): Promise<import(".prisma/client").Prisma.BatchPayload | null>;
    updateSubServices(userId: string, subServices: any[]): Promise<import(".prisma/client").Prisma.BatchPayload | null>;
    uploadDocument(userId: string, data: {
        type: string;
        url?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        providerId: string;
        status: string;
        type: string;
        url: string | null;
    } | null>;
}
