import { PrismaService } from '../prisma/prisma.service';
export declare class PostsService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllPosts(): Promise<({
        user: {
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: import(".prisma/client").$Enums.PostType;
        text: string;
        likes: number;
        comments: number;
    })[]>;
    createPost(userId: string, data: {
        text: string;
        type: any;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: import(".prisma/client").$Enums.PostType;
        text: string;
        likes: number;
        comments: number;
    }>;
}
