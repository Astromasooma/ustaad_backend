import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<({
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
    updateProfile(req: any, body: any): Promise<{
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
    updateTheme(req: any, theme: string): Promise<{
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
    updateLanguage(req: any, language: string): Promise<{
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
    updateNotifications(req: any, body: any): Promise<{
        id: string;
        userId: string;
        pushEnabled: boolean;
        smsEnabled: boolean;
        emailEnabled: boolean;
    }>;
    addAddress(req: any, body: any): Promise<{
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
    deleteAddress(req: any, id: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
