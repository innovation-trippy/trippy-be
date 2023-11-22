import { Test, TestingModule } from '@nestjs/testing';
import { AvsecController } from './avsec.controller';
import { AvsecService } from './avsec.service';

describe('AvsecController', () => {
  let controller: AvsecController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvsecController],
      providers: [AvsecService],
    }).compile();

    controller = module.get<AvsecController>(AvsecController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
