import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        notificationSettings: true,
        addresses: true,
      },
    });
  }

  async updateProfile(userId: string, data: { name?: string; phone?: string; email?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async updateTheme(userId: string, theme: any) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { theme },
    });
  }

  async updateLanguage(userId: string, language: any) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { language },
    });
  }

  async updateNotificationSettings(userId: string, data: any) {
    return this.prisma.notificationSettings.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  }

  async addAddress(userId: string, data: any) {
    return this.prisma.address.create({
      data: { userId, ...data },
    });
  }

  async deleteAddress(id: string, userId: string) {
    return this.prisma.address.deleteMany({
      where: { id, userId },
    });
  }
}
