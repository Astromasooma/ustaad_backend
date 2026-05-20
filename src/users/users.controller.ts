import { Controller, Get, Patch, Post, Delete, Body, UseGuards, Request, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  getProfile(@Request() req: any) {
    return this.usersService.getProfile(req.user.id);
  }

  @Patch('profile')
  updateProfile(@Request() req: any, @Body() body: any) {
    return this.usersService.updateProfile(req.user.id, body);
  }

  @Patch('theme')
  updateTheme(@Request() req: any, @Body('theme') theme: string) {
    return this.usersService.updateTheme(req.user.id, theme);
  }

  @Patch('language')
  updateLanguage(@Request() req: any, @Body('language') language: string) {
    return this.usersService.updateLanguage(req.user.id, language);
  }

  @Patch('notifications')
  updateNotifications(@Request() req: any, @Body() body: any) {
    return this.usersService.updateNotificationSettings(req.user.id, body);
  }

  @Post('addresses')
  addAddress(@Request() req: any, @Body() body: any) {
    return this.usersService.addAddress(req.user.id, body);
  }

  @Delete('addresses/:id')
  deleteAddress(@Request() req: any, @Param('id') id: string) {
    return this.usersService.deleteAddress(id, req.user.id);
  }
}
