import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getPosts() {
    return this.postsService.getAllPosts();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createPost(@Request() req: any, @Body() body: { text: string; type: string }) {
    return this.postsService.createPost(req.user.id, body);
  }
}
