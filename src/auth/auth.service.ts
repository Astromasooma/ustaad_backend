import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if phone already exists
    const existing = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });
    if (existing) {
      throw new ConflictException('Phone number already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        email: dto.email,
        password: hashedPassword,
        role: dto.role as any,
      },
    });

    // Create provider profile if role is PROVIDER
    if (dto.role === 'PROVIDER') {
      await this.prisma.provider.create({
        data: { userId: user.id, category: dto.category },
      });
    }

    const token = this.generateToken(user.id, user.role);

    return {
      token,
      user: {
        ...this.sanitizeUser(user),
        category: dto.role === 'PROVIDER' ? (dto.category ?? null) : null,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid phone or password');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid phone or password');
    }

    const token = this.generateToken(user.id, user.role);

    // Fetch provider category if PROVIDER
    let category: string | null = null;
    if (user.role === 'PROVIDER') {
      const provider = await this.prisma.provider.findUnique({
        where: { userId: user.id },
      });
      category = provider?.category ?? null;
    }

    return {
      token,
      user: { ...this.sanitizeUser(user), category },
    };
  }

  async validateToken(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    return user ? this.sanitizeUser(user) : null;
  }

  private generateToken(userId: string, role: string) {
    return this.jwtService.sign({ sub: userId, role });
  }

  private sanitizeUser(user: any) {
    const { password, ...rest } = user;
    return rest;
  }
}
