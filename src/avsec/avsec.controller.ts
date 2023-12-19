import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AvsecService } from './avsec.service';

@Controller('avsec')
export class AvsecController {
  constructor(private readonly avsecService: AvsecService) { }

  @Get(':id')
  searchForbidId(@Param('id') id: string): any {
    return this.avsecService.getForbidInfo(id);
  }
  
}
