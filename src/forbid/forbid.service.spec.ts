import { Test, TestingModule } from '@nestjs/testing';
import { ForbidService } from './forbid.service';

describe('ForbidService', () => {
  let service: ForbidService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ForbidService],
    }).compile();

    service = module.get<ForbidService>(ForbidService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
