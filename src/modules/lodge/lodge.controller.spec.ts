import { Test, TestingModule } from '@nestjs/testing';
import { LodgeController } from './lodge.controller';
import { LodgeService } from './lodge.service';

describe('LodgeController', () => {
  let controller: LodgeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LodgeController],
      providers: [LodgeService],
    }).compile();

    controller = module.get<LodgeController>(LodgeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
