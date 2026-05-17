import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  IsEnum,
  IsPhoneNumber,
} from 'class-validator';

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  PROVIDER = 'PROVIDER',
  ADMIN = 'ADMIN',
}

export class RegisterDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsEmail()
  @IsOptional()
  email?: string;
}

export class LoginDto {
  @IsString()
  phone: string;

  @IsString()
  password: string;
}
