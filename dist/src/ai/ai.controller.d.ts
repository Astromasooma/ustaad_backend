import { AiService } from './ai.service';
export declare class AiController {
    private aiService;
    constructor(aiService: AiService);
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
    matchProviders(body: {
        serviceType: string;
        urgencyLevel: string;
        complexityLevel: string;
        latitude?: number;
        longitude?: number;
    }, req: any): Promise<{
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
    calculatePrice(body: {
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
    resolveDispute(body: {
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
}
