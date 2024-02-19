import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ForbidService } from './forbid.service';

type Forbid = {
  korName: string;
  engName: string;
  forbidRule: string;
  specialRule: string;
  exampleImg: string;
}

@Controller('forbid')
export class ForbidController {
  constructor(private readonly forbidService: ForbidService) {}

  @Get(':nation/:item')
  getForbid(
    @Param('nation') nation: string,
    @Param('item') item: string,
  ) {
    return this.forbidService.getForbidItem(nation, item);
  }

  // @Post()
  // postForbid(
  //   @Body('korName') korName: string,
  //   @Body('engName') engName: string,
  //   @Body('forbidImg') forbidImg: string,
  //   @Body('forbidRule') forbidRule: string,
  //   @Body('specialRule') specialRule: string,
  //   @Body('exampleImg') exampleImg: string,
  // ) {
  //   return this.forbidService.createForbidItem({korName, engName, forbidImg, forbidRule, specialRule, exampleImg});
  // }
}
