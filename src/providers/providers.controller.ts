import { Controller, Get, Patch, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProvidersService } from './providers.service';

@Controller('providers')
@UseGuards(AuthGuard('jwt'))
export class ProvidersController {
  constructor(private providersService: ProvidersService) {}

  @Get('settings')
  getSettings(@Request() req: any) {
    return this.providersService.getSettings(req.user.id);
  }

  @Get('dashboard-stats')
  getDashboardStats(@Request() req: any) {
    return this.providersService.getDashboardStats(req.user.id);
  }

  @Get('analytics')
  getAnalytics(@Request() req: any) {
    return this.providersService.getAnalytics(req.user.id);
  }

  @Patch('pricing')
  updatePricing(@Request() req: any, @Body() body: any) {
    return this.providersService.updatePricing(req.user.id, body);
  }

  @Patch('schedules')
  updateSchedules(@Request() req: any, @Body() body: { schedules: any[] }) {
    return this.providersService.updateSchedules(req.user.id, body.schedules);
  }

  @Patch('sub-services')
  updateSubServices(@Request() req: any, @Body() body: { subServices: any[] }) {
    return this.providersService.updateSubServices(req.user.id, body.subServices);
  }

  @Post('documents')
  uploadDocument(@Request() req: any, @Body() body: any) {
    return this.providersService.uploadDocument(req.user.id, body);
  }
}
