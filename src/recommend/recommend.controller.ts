import { Body, Controller, Get, Patch } from '@nestjs/common';
import { RecommendService } from './recommend.service';

@Controller('recommend')
export class RecommendController {
  constructor(private readonly recommendService: RecommendService) {}

  @Get()
  getRecommend(
    @Body('nationName') nationName: string,
  ) {
    return this.recommendService.getRecommend(nationName);
  }

  @Patch()
  updateLikeCount(
    @Body('recommendId') recommendId: string,
    @Body('likeCount') likeCount: string,
  ) {
    return this.recommendService.updateLikeCount(recommendId, likeCount);
  }
}
