import { Test, TestingModule } from '@nestjs/testing';
import { AvsecService } from './avsec.service';

describe('AvsecService', () => {
  let service: AvsecService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AvsecService],
    }).compile();

    service = module.get<AvsecService>(AvsecService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
