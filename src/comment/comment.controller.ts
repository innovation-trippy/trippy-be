import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer_token.guard';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':itemId')
  getComment(
    @Param('itemId') itemId, 
  ) {
    return this.commentService.getComment(itemId);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  postComment(
    @Req() req,
    @Body('itemId') itemId:string,
    @Body('content') content:string,
  ) {
    const userEmail = req.email;
    return this.commentService.createComment(userEmail, itemId, content);
  }

  @Patch()
  @UseGuards(AccessTokenGuard)
  updateComment(
    @Req() req,
    @Body('commentId') commentId,
    @Body('itemId') itemId:string,
    @Body('content') content:string,
  ) {
    const userEmail = req.email;
    return this.commentService.updateComment(userEmail, commentId, itemId, content);
  }

  @Delete()
  @UseGuards(AccessTokenGuard)
  deleteComment(
    @Req() req,
    @Body('commentId') commentId,
  ) {
    const userEmail = req.email;
    return this.commentService.deleteComment(userEmail, commentId);
  }

  @Patch('likecount')
  updateLikeCount(
    @Body('commentId') commentId,
    @Body('likeCount') likeCount,
  ) {
    return this.commentService.updateLikeCount(commentId, likeCount);
  }


}
