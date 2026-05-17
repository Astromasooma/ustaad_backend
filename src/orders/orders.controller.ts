import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get('my')
  getMyOrders(@Request() req: any) {
    return this.ordersService.getMyOrders(req.user.id, req.user.role);
  }

  @Get(':id')
  getOrder(@Param('id') id: string) {
    return this.ordersService.getOrderById(id);
  }

  @Post()
  createOrder(@Body() body: any, @Request() req: any) {
    return this.ordersService.createOrder(req.user.id, body);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Request() req: any,
  ) {
    return this.ordersService.updateStatus(id, status, req.user.id);
  }

  @Post(':id/dispute')
  raiseDispute(
    @Param('id') id: string,
    @Body() body: { reason: string; description?: string },
    @Request() req: any,
  ) {
    return this.ordersService.raiseDispute(id, req.user.id, body);
  }
}
