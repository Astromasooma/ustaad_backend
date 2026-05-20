import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// ─────────────────────────────────────────────────────────
// AI Orchestrator Service
// Simulates Google Antigravity AI reasoning engine.
// Replace the mock methods with real Antigravity API calls.
// ─────────────────────────────────────────────────────────
@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  // ── 1. Parse Natural Language Intent ──────────────────
  async parseIntent(input: string) {
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

  // ── 2. Match & Rank Providers ──────────────────────────
  async matchProviders(params: {
    serviceType: string;
    urgencyLevel: string;
    complexityLevel: string;
    latitude?: number;
    longitude?: number;
    customerId: string;
  }) {
    // Fetch providers from DB
    const providers = await this.prisma.provider.findMany({
      where: {
        isAvailable: true,
        isVerified: true,
        specializationTags: { hasSome: [params.serviceType] },
      },
      include: { user: true },
      take: 5,
    });

    // If no real providers, return mock data
    const mockProviders = this.getMockProviders(params.serviceType);

    const ranked = (providers.length > 0 ? providers : mockProviders).map(
      (p: any, i: number) => ({
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
      }),
    );

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
      // Provide available sub-services and estimated base rates for frontend
      subServices: this.getSubServices(params.serviceType),
      suggestedSlot: 'Tomorrow 10:00 AM',
    };
  }

  private getSubServices(serviceType: string) {
    const lower = serviceType.toLowerCase();
    if (lower.includes('beauty') || lower.includes('beautician')) {
      return {
        'Hair Styling': 1500,
        'Facial Treatment': 2000,
        'Waxing (Full Arms/Legs)': 1200,
        'Threading': 300,
        'Bridal Glow': 4500,
      } as any;
    }
    if (lower.includes('ac') || lower.includes('ac repair')) {
      return {
        'AC General Service': 1500,
        'Gas Leak Repair': 3500,
        'Compressor Replacement': 8000,
        'AC Filter Clean': 500,
      } as any;
    }
    if (lower.includes('plumb') || lower.includes('plumbing')) {
      return {
        'Leakage Fixing': 800,
        'Commode Installation': 3000,
        'Tap Replacement': 500,
        'Pipeline Unclogging': 1200,
      } as any;
    }
    if (lower.includes('electric') || lower.includes('electrician')) {
      return {
        'Fan Repairing': 600,
        'House Wiring (per point)': 200,
        'UPS Maintenance': 1500,
        'Short Circuit Fix': 1000,
      } as any;
    }

    // Generic fallback
    return {
      'Standard Visit & Fix': 1000,
      'Premium Care Pack': 2500,
      'Emergency Diagnostic': 1500,
    } as any;
  }

  // ── 3. Dynamic Pricing Engine ──────────────────────────
  calculatePrice(params: {
    serviceType: string;
    urgencyLevel: string;
    complexityLevel: string;
    distanceKm?: number;
  }) {
    const baseFees: Record<string, number> = {
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
    const urgencyFee =
      params.urgencyLevel === 'URGENT' ? 500 :
      params.urgencyLevel === 'HIGH' ? 300 : 0;
    const complexityFee =
      params.complexityLevel === 'COMPLEX' ? 800 :
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

  // ── 4. AI Dispute Resolution ───────────────────────────
  async resolveDispute(params: {
    orderId: string;
    disputeReason: string;
  }) {
    const order = await this.prisma.order.findUnique({
      where: { id: params.orderId },
      include: { disputes: true },
    });

    const reason = params.disputeReason.toLowerCase();
    let recommendation: string;
    let compensation: string;
    let confidence: number;
    let action: string;
    let escalate: boolean;
    let reasoning: string;

    if (reason.includes('no-show') || reason.includes('noshow')) {
      recommendation = 'Full Refund Recommended';
      compensation = `Rs. ${order?.totalAmount ?? 0}`;
      confidence = 94;
      action = 'REFUND';
      escalate = false;
      reasoning = 'Booking logs confirm no service initiation. Full refund recommended.';
    } else if (reason.includes('overcharg')) {
      recommendation = 'Partial Refund Recommended';
      compensation = 'Rs. 500';
      confidence = 78;
      action = 'PARTIAL_REFUND';
      escalate = false;
      reasoning = 'Price discrepancy detected against AI-calculated fair price.';
    } else {
      recommendation = 'Escalate to Admin';
      compensation = 'Pending Review';
      confidence = 55;
      action = 'ESCALATE';
      escalate = true;
      reasoning = 'Dispute requires human review. Escalating to admin.';
    }

    // Save AI analysis to DB
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
          } as any,
        },
      });
    }

    return { recommendation, compensation, confidence, action, escalate, reasoning };
  }

  // ── Private Helpers ────────────────────────────────────
  private extractIntent(input: string) {
    if (input.includes('plumb') || input.includes('pipe') || input.includes('tap')) {
      return { intent: 'Book Plumbing Service', serviceType: 'Plumbing', confidence: 92 };
    } else if (input.includes('ac') || input.includes('cooling') || input.includes('air')) {
      return { intent: 'AC Repair/Service', serviceType: 'AC Repair', confidence: 95 };
    } else if (input.includes('electric') || input.includes('wiring') || input.includes('current')) {
      return { intent: 'Electrical Service', serviceType: 'Electrician', confidence: 90 };
    } else if (input.includes('beauty') || input.includes('beautician') || input.includes('salon')) {
      return { intent: 'Beauty Service', serviceType: 'Beautician', confidence: 88 };
    } else if (input.includes('clean')) {
      return { intent: 'Cleaning Service', serviceType: 'Cleaning', confidence: 85 };
    } else if (input.includes('carpenter') || input.includes('furniture')) {
      return { intent: 'Carpentry Service', serviceType: 'Carpenter', confidence: 87 };
    }
    return { intent: 'Unknown Service Request', serviceType: 'General', confidence: 45 };
  }

  private detectUrgency(input: string): string {
    if (input.includes('urgent') || input.includes('abhi') || input.includes('emergency')) {
      return 'URGENT';
    }
    if (input.includes('today') || input.includes('aaj') || input.includes('asap')) {
      return 'HIGH';
    }
    return 'NORMAL';
  }

  private detectComplexity(input: string): string {
    if (input.includes('compressor') || input.includes('install') || input.includes('replace')) {
      return 'COMPLEX';
    }
    if (input.includes('gas') || input.includes('refill') || input.includes('service')) {
      return 'INTERMEDIATE';
    }
    return 'BASIC';
  }

  private buildRankingReason(provider: any, rank: number, serviceType: string): string {
    const reasons = [
      `Best ${serviceType} specialization, highest reliability, lowest cancellation rate`,
      `Strong rating, dual specialization, good availability`,
      `Budget-friendly option, solid track record`,
      `Local provider, quick availability`,
      `Experienced in ${serviceType}, good reviews`,
    ];
    return reasons[rank] ?? reasons[0];
  }

  private getMockProviders(serviceType: string) {
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
}
