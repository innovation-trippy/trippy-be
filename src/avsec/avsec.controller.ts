import { Controller, Get, Param } from '@nestjs/common';
import { AvsecService } from './avsec.service';

@Controller('avsec')
export class AvsecController {
  constructor(private readonly avsecService: AvsecService) { }

  @Get()
  getTest() {
    return this.avsecService.test();
  }

  @Get('search/:item')
  searchForbidId(@Param('item') item: string): any {
    return this.avsecService.getForbidInfo(item);
  }

  // @Get('save/:item')
  // saveForbidItem(@Param('item') item: string): any {
  //   return this.avsecService.saveForbidInfo(item);
  // }

  // @Get('save')
  // saveUsForbidInfo() {
  //   return this.avsecService.saveUsForbidInfo();
  // }
  
}
