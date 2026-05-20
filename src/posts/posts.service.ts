import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async getAllPosts() {
    return this.prisma.post.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async createPost(userId: string, data: { text: string; type: any }) {
    return this.prisma.post.create({
      data: {
        userId,
        text: data.text,
        type: data.type,
      },
    });
  }
}
