import { Test, TestingModule } from '@nestjs/testing';
import { ForbidController } from './forbid.controller';
import { ForbidService } from './forbid.service';

describe('ForbidController', () => {
  let controller: ForbidController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForbidController],
      providers: [ForbidService],
    }).compile();

    controller = module.get<ForbidController>(ForbidController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
