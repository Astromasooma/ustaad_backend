import { PrismaService } from '../prisma/prisma.service';
export declare class AiService {
    private prisma;
    constructor(prisma: PrismaService);
    parseIntent(input: string): Promise<{
        intent: string;
        intentConfidence: number;
        serviceType: string;
        location: string;
        locationConfidence: number;
        urgencyLevel: string;
        complexityLevel: string;
        budgetSensitivity: string;
        clarificationQuestions: string[];
        raw: string;
    }>;
    matchProviders(params: {
        serviceType: string;
        urgencyLevel: string;
        complexityLevel: string;
        latitude?: number;
        longitude?: number;
        customerId: string;
    }): Promise<{
        rankedProviders: {
            provider: {
                id: any;
                name: any;
                phone: any;
                specializationTags: any;
                reliabilityScore: any;
                cancellationRate: any;
                distanceKm: string;
                isAvailable: boolean;
            };
            matchScore: number;
            rankingReason: string;
        }[];
        intentTrace: string;
        intentConfidence: number;
        serviceType: string;
        complexityLevel: string;
        urgencyLevel: string;
        pricing: {
            baseFee: number;
            distanceFee: number;
            urgencyMultiplier: number;
            complexityFee: number;
            surgeFee: number;
            discount: number;
            total: number;
            currency: string;
            reasoning: string;
        };
        subServices: any;
        suggestedSlot: string;
    }>;
    private getSubServices;
    calculatePrice(params: {
        serviceType: string;
        urgencyLevel: string;
        complexityLevel: string;
        distanceKm?: number;
    }): {
        baseFee: number;
        distanceFee: number;
        urgencyMultiplier: number;
        complexityFee: number;
        surgeFee: number;
        discount: number;
        total: number;
        currency: string;
        reasoning: string;
    };
    resolveDispute(params: {
        orderId: string;
        disputeReason: string;
    }): Promise<{
        recommendation: string;
        compensation: string;
        confidence: number;
        action: string;
        escalate: boolean;
        reasoning: string;
    }>;
    private extractIntent;
    private detectUrgency;
    private detectComplexity;
    private buildRankingReason;
    private getMockProviders;
}
