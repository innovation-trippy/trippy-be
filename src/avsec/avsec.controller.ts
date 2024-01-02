import { Controller, Get, Param } from '@nestjs/common';
import { AvsecService } from './avsec.service';

@Controller('avsec')
export class AvsecController {
  constructor(private readonly avsecService: AvsecService) { }

  @Get()
  getTest() {
    return this.avsecService.test();
  }

  @Get(':id')
  searchForbidId(@Param('id') id: string): any {
    return this.avsecService.getForbidInfo(id);
  }
  
}
