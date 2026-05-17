import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('parse-intent')
  @UseGuards(AuthGuard('jwt'))
  parseIntent(@Body('input') input: string) {
    return this.aiService.parseIntent(input);
  }

  @Post('match-providers')
  @UseGuards(AuthGuard('jwt'))
  matchProviders(
    @Body() body: {
      serviceType: string;
      urgencyLevel: string;
      complexityLevel: string;
      latitude?: number;
      longitude?: number;
    },
    @Request() req: any,
  ) {
    return this.aiService.matchProviders({ ...body, customerId: req.user.id });
  }

  @Post('calculate-price')
  @UseGuards(AuthGuard('jwt'))
  calculatePrice(
    @Body() body: {
      serviceType: string;
      urgencyLevel: string;
      complexityLevel: string;
      distanceKm?: number;
    },
  ) {
    return this.aiService.calculatePrice(body);
  }

  @Post('resolve-dispute')
  @UseGuards(AuthGuard('jwt'))
  resolveDispute(
    @Body() body: { orderId: string; disputeReason: string },
  ) {
    return this.aiService.resolveDispute(body);
  }
}
