export declare enum UserRole {
    CUSTOMER = "CUSTOMER",
    PROVIDER = "PROVIDER",
    ADMIN = "ADMIN"
}
export declare class RegisterDto {
    name: string;
    phone: string;
    password: string;
    role: UserRole;
    email?: string;
    category?: string;
}
export declare class LoginDto {
    phone: string;
    password: string;
}
