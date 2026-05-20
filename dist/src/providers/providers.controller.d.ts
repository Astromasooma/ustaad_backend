import { ProvidersService } from './providers.service';
export declare class ProvidersController {
    private providersService;
    constructor(providersService: ProvidersService);
    getSettings(req: any): Promise<({
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
            type: string;
            url: string | null;
            status: string;
        }[];
    } & {
        id: string;
        userId: string;
        specializationTags: string[];
        category: string | null;
        reliabilityScore: number;
        cancellationRate: number;
        workloadCapacity: number;
        disputeCount: number;
        reviewSentimentScore: number;
        isAvailable: boolean;
        isVerified: boolean;
        minPrice: number | null;
        maxPrice: number | null;
        firstBookingDiscount: number | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    getDashboardStats(req: any): Promise<{
        todaysEarnings: number;
        pendingJobsCount: number;
        completedJobsCount: number;
        rating: number;
        incomingJobs: ({
            customer: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                role: import(".prisma/client").$Enums.Role;
                phone: string;
                email: string | null;
                password: string;
                theme: import(".prisma/client").$Enums.Theme;
                language: import(".prisma/client").$Enums.Language;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            providerId: string | null;
            customerId: string;
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
        })[];
    } | null>;
    getAnalytics(req: any): Promise<{
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
    updatePricing(req: any, body: any): Promise<{
        id: string;
        userId: string;
        specializationTags: string[];
        category: string | null;
        reliabilityScore: number;
        cancellationRate: number;
        workloadCapacity: number;
        disputeCount: number;
        reviewSentimentScore: number;
        isAvailable: boolean;
        isVerified: boolean;
        minPrice: number | null;
        maxPrice: number | null;
        firstBookingDiscount: number | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateSchedules(req: any, body: {
        schedules: any[];
    }): Promise<import(".prisma/client").Prisma.BatchPayload | null>;
    updateSubServices(req: any, body: {
        subServices: any[];
    }): Promise<import(".prisma/client").Prisma.BatchPayload | null>;
    uploadDocument(req: any, body: any): Promise<{
        id: string;
        createdAt: Date;
        providerId: string;
        type: string;
        url: string | null;
        status: string;
    } | null>;
}
