import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<({
        addresses: {
            id: string;
            label: string;
            houseFlatNo: string;
            area: string;
            city: string;
            landmark: string | null;
            postalCode: string | null;
            latitude: number | null;
            longitude: number | null;
            isDefault: boolean;
            userId: string;
        }[];
        notificationSettings: {
            id: string;
            pushEnabled: boolean;
            smsEnabled: boolean;
            emailEnabled: boolean;
            userId: string;
        } | null;
    } & {
        id: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        phone: string;
        email: string | null;
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
        role: import(".prisma/client").$Enums.Role;
        name: string;
        phone: string;
        email: string | null;
        password: string;
        theme: import(".prisma/client").$Enums.Theme;
        language: import(".prisma/client").$Enums.Language;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateTheme(userId: string, theme: any): Promise<{
        id: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        phone: string;
        email: string | null;
        password: string;
        theme: import(".prisma/client").$Enums.Theme;
        language: import(".prisma/client").$Enums.Language;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateLanguage(userId: string, language: any): Promise<{
        id: string;
        role: import(".prisma/client").$Enums.Role;
        name: string;
        phone: string;
        email: string | null;
        password: string;
        theme: import(".prisma/client").$Enums.Theme;
        language: import(".prisma/client").$Enums.Language;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateNotificationSettings(userId: string, data: any): Promise<{
        id: string;
        pushEnabled: boolean;
        smsEnabled: boolean;
        emailEnabled: boolean;
        userId: string;
    }>;
    addAddress(userId: string, data: any): Promise<{
        id: string;
        label: string;
        houseFlatNo: string;
        area: string;
        city: string;
        landmark: string | null;
        postalCode: string | null;
        latitude: number | null;
        longitude: number | null;
        isDefault: boolean;
        userId: string;
    }>;
    deleteAddress(id: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
