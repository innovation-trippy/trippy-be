import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AvsecService } from './avsec.service';
import { Observable } from 'rxjs';

@Controller('avsec')
export class AvsecController {
  constructor(private readonly avsecService: AvsecService) { }
  /*
    @Post()
    create(@Body() createAvsecDto: CreateAvsecDto) {
      return this.avsecService.create(createAvsecDto);
    }
  */
  @Get()
  getProducts(): Observable<any> {
    return this.avsecService.getProducts();
  }

  @Get(':id')
  findOne(@Param('id') id: string): any {
    return this.avsecService.findOne(id);
  }
  /*
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateAvsecDto: UpdateAvsecDto) {
      return this.avsecService.update(+id, updateAvsecDto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.avsecService.remove(+id);
    }
    */
}
