import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from '../../database/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserService', () => {
  let service: UserService;

  const mockUserRepository = {
    insert: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
