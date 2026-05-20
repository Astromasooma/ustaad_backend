import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<({
        addresses: {
            id: string;
            userId: string;
            label: string;
            houseFlatNo: string;
            area: string;
            city: string;
            landmark: string | null;
            postalCode: string | null;
            latitude: number | null;
            longitude: number | null;
            isDefault: boolean;
        }[];
        notificationSettings: {
            id: string;
            userId: string;
            pushEnabled: boolean;
            smsEnabled: boolean;
            emailEnabled: boolean;
        } | null;
    } & {
        id: string;
        phone: string;
        email: string | null;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        password: string;
        theme: import(".prisma/client").$Enums.Theme;
        language: import(".prisma/client").$Enums.Language;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    updateProfile(userId: string, data: {
        name?: string;
        phone?: string;
        email?: string;
    }): Promise<{
        id: string;
        phone: string;
        email: string | null;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        password: string;
        theme: import(".prisma/client").$Enums.Theme;
        language: import(".prisma/client").$Enums.Language;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateTheme(userId: string, theme: any): Promise<{
        id: string;
        phone: string;
        email: string | null;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        password: string;
        theme: import(".prisma/client").$Enums.Theme;
        language: import(".prisma/client").$Enums.Language;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateLanguage(userId: string, language: any): Promise<{
        id: string;
        phone: string;
        email: string | null;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        password: string;
        theme: import(".prisma/client").$Enums.Theme;
        language: import(".prisma/client").$Enums.Language;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateNotificationSettings(userId: string, data: any): Promise<{
        id: string;
        userId: string;
        pushEnabled: boolean;
        smsEnabled: boolean;
        emailEnabled: boolean;
    }>;
    addAddress(userId: string, data: any): Promise<{
        id: string;
        userId: string;
        label: string;
        houseFlatNo: string;
        area: string;
        city: string;
        landmark: string | null;
        postalCode: string | null;
        latitude: number | null;
        longitude: number | null;
        isDefault: boolean;
    }>;
    deleteAddress(id: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
