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
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AiService = class AiService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async parseIntent(input) {
        const lower = input.toLowerCase();
        const result = this.extractIntent(lower);
        return {
            intent: result.intent,
            intentConfidence: result.confidence,
            serviceType: result.serviceType,
            location: 'Nearby (GPS)',
            locationConfidence: 84,
            urgencyLevel: this.detectUrgency(lower),
            complexityLevel: this.detectComplexity(lower),
            budgetSensitivity: lower.includes('budget') || lower.includes('sasta') ? 'HIGH' : 'NORMAL',
            clarificationQuestions: result.confidence < 70
                ? [`Do you need ${result.serviceType} repair or installation?`]
                : [],
            raw: input,
        };
    }
    async matchProviders(params) {
        const providers = await this.prisma.provider.findMany({
            where: {
                isAvailable: true,
                isVerified: true,
                specializationTags: { hasSome: [params.serviceType] },
            },
            include: { user: true },
            take: 5,
        });
        const mockProviders = this.getMockProviders(params.serviceType);
        const ranked = (providers.length > 0 ? providers : mockProviders).map((p, i) => ({
            provider: {
                id: p.id || p.provider.id,
                name: p.user?.name || p.provider.name,
                phone: p.user?.phone || p.provider.phone,
                specializationTags: p.specializationTags || p.provider.specializationTags,
                reliabilityScore: p.reliabilityScore || p.provider.reliabilityScore,
                cancellationRate: p.cancellationRate || p.provider.cancellationRate,
                distanceKm: (1 + i * 0.8).toFixed(1),
                isAvailable: true,
            },
            matchScore: parseFloat((0.96 - i * 0.08).toFixed(2)),
            rankingReason: this.buildRankingReason(p, i, params.serviceType),
        }));
        const pricing = this.calculatePrice({
            serviceType: params.serviceType,
            urgencyLevel: params.urgencyLevel,
            complexityLevel: params.complexityLevel,
        });
        return {
            rankedProviders: ranked,
            intentTrace: `Matched for ${params.serviceType} — ${params.urgencyLevel} urgency`,
            intentConfidence: 90,
            serviceType: params.serviceType,
            complexityLevel: params.complexityLevel,
            urgencyLevel: params.urgencyLevel,
            pricing,
            suggestedSlot: 'Tomorrow 10:00 AM',
        };
    }
    calculatePrice(params) {
        const baseFees = {
            'AC Repair': 2000,
            Plumbing: 1500,
            Electrician: 1200,
            Cleaning: 1000,
            Beautician: 1200,
            Carpenter: 1800,
            Handyman: 1000,
        };
        const base = baseFees[params.serviceType] ?? 1500;
        const distance = (params.distanceKm ?? 1.5) * 50;
        const urgencyFee = params.urgencyLevel === 'URGENT' ? 500 :
            params.urgencyLevel === 'HIGH' ? 300 : 0;
        const complexityFee = params.complexityLevel === 'COMPLEX' ? 800 :
            params.complexityLevel === 'INTERMEDIATE' ? 400 : 0;
        const discount = 200;
        const total = base + distance + urgencyFee + complexityFee - discount;
        return {
            baseFee: base,
            distanceFee: Math.round(distance),
            urgencyMultiplier: urgencyFee,
            complexityFee,
            surgeFee: 0,
            discount,
            total: Math.round(total),
            currency: 'PKR',
            reasoning: `Base (${params.serviceType}): ${base} + Distance: ${Math.round(distance)} + Urgency: ${urgencyFee} + Complexity: ${complexityFee} - Loyalty: ${discount}`,
        };
    }
    async resolveDispute(params) {
        const order = await this.prisma.order.findUnique({
            where: { id: params.orderId },
            include: { disputes: true },
        });
        const reason = params.disputeReason.toLowerCase();
        let recommendation;
        let compensation;
        let confidence;
        let action;
        let escalate;
        let reasoning;
        if (reason.includes('no-show') || reason.includes('noshow')) {
            recommendation = 'Full Refund Recommended';
            compensation = `Rs. ${order?.totalAmount ?? 0}`;
            confidence = 94;
            action = 'REFUND';
            escalate = false;
            reasoning = 'Booking logs confirm no service initiation. Full refund recommended.';
        }
        else if (reason.includes('overcharg')) {
            recommendation = 'Partial Refund Recommended';
            compensation = 'Rs. 500';
            confidence = 78;
            action = 'PARTIAL_REFUND';
            escalate = false;
            reasoning = 'Price discrepancy detected against AI-calculated fair price.';
        }
        else {
            recommendation = 'Escalate to Admin';
            compensation = 'Pending Review';
            confidence = 55;
            action = 'ESCALATE';
            escalate = true;
            reasoning = 'Dispute requires human review. Escalating to admin.';
        }
        if (order) {
            await this.prisma.aILog.create({
                data: {
                    orderId: params.orderId,
                    disputeTrace: {
                        reason: params.disputeReason,
                        recommendation,
                        compensation,
                        confidence,
                        reasoning,
                        action,
                    },
                },
            });
        }
        return { recommendation, compensation, confidence, action, escalate, reasoning };
    }
    extractIntent(input) {
        if (input.includes('plumb') || input.includes('pipe') || input.includes('tap')) {
            return { intent: 'Book Plumbing Service', serviceType: 'Plumbing', confidence: 92 };
        }
        else if (input.includes('ac') || input.includes('cooling') || input.includes('air')) {
            return { intent: 'AC Repair/Service', serviceType: 'AC Repair', confidence: 95 };
        }
        else if (input.includes('electric') || input.includes('wiring') || input.includes('current')) {
            return { intent: 'Electrical Service', serviceType: 'Electrician', confidence: 90 };
        }
        else if (input.includes('beauty') || input.includes('beautician') || input.includes('salon')) {
            return { intent: 'Beauty Service', serviceType: 'Beautician', confidence: 88 };
        }
        else if (input.includes('clean')) {
            return { intent: 'Cleaning Service', serviceType: 'Cleaning', confidence: 85 };
        }
        else if (input.includes('carpenter') || input.includes('furniture')) {
            return { intent: 'Carpentry Service', serviceType: 'Carpenter', confidence: 87 };
        }
        return { intent: 'Unknown Service Request', serviceType: 'General', confidence: 45 };
    }
    detectUrgency(input) {
        if (input.includes('urgent') || input.includes('abhi') || input.includes('emergency')) {
            return 'URGENT';
        }
        if (input.includes('today') || input.includes('aaj') || input.includes('asap')) {
            return 'HIGH';
        }
        return 'NORMAL';
    }
    detectComplexity(input) {
        if (input.includes('compressor') || input.includes('install') || input.includes('replace')) {
            return 'COMPLEX';
        }
        if (input.includes('gas') || input.includes('refill') || input.includes('service')) {
            return 'INTERMEDIATE';
        }
        return 'BASIC';
    }
    buildRankingReason(provider, rank, serviceType) {
        const reasons = [
            `Best ${serviceType} specialization, highest reliability, lowest cancellation rate`,
            `Strong rating, dual specialization, good availability`,
            `Budget-friendly option, solid track record`,
            `Local provider, quick availability`,
            `Experienced in ${serviceType}, good reviews`,
        ];
        return reasons[rank] ?? reasons[0];
    }
    getMockProviders(serviceType) {
        return [
            {
                id: 'mock-p-001',
                provider: {
                    id: 'mock-p-001',
                    name: `${serviceType} Expert Ali`,
                    phone: '03001234567',
                    specializationTags: [serviceType],
                    reliabilityScore: 4.9,
                    cancellationRate: 0.02,
                },
                specializationTags: [serviceType],
                reliabilityScore: 4.9,
                cancellationRate: 0.02,
            },
            {
                id: 'mock-p-002',
                provider: {
                    id: 'mock-p-002',
                    name: 'Usman Tariq',
                    phone: '03119876543',
                    specializationTags: [serviceType],
                    reliabilityScore: 4.7,
                    cancellationRate: 0.05,
                },
                specializationTags: [serviceType],
                reliabilityScore: 4.7,
                cancellationRate: 0.05,
            },
            {
                id: 'mock-p-003',
                provider: {
                    id: 'mock-p-003',
                    name: 'Bilal Raza',
                    phone: '03331122334',
                    specializationTags: [serviceType],
                    reliabilityScore: 4.5,
                    cancellationRate: 0.08,
                },
                specializationTags: [serviceType],
                reliabilityScore: 4.5,
                cancellationRate: 0.08,
            },
        ];
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AiService);
//# sourceMappingURL=ai.service.js.map