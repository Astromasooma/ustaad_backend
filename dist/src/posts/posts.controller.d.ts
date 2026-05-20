import { PostsService } from './posts.service';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    getPosts(): Promise<({
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
    createPost(req: any, body: {
        text: string;
        type: string;
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
