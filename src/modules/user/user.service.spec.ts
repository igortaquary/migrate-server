import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from '../../database/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotImplementedException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;

  const mockUserRepository = {
    insert: jest.fn().mockImplementation(() => {
      return {
        identifiers: [{ id: 12345 }],
      };
    }),
    findOne: jest.fn().mockImplementation(() => ({
      id: '12',
      name: 'User',
      email: 'user@email.com',
    })),
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

  describe('create', () => {
    it('should call repository create', async () => {
      expect(await service.create({ name: 'igor' })).toEqual(12345);
    });
  });

  describe('findOne', () => {
    it('should call repository findOne', async () => {
      expect(await service.findOne('12')).toEqual({
        id: '12',
        name: 'User',
        email: 'user@email.com',
      });
    });
  });

  describe('findOneByEmail', () => {
    it('should call repository findOne', async () => {
      expect(await service.findOneByEmail('user@email.com')).toEqual({
        id: '12',
        name: 'User',
        email: 'user@email.com',
      });
    });
  });

  describe('update', () => {
    it('should call repository update', async () => {
      expect(await service.update('45', { name: 'new name' })).toEqual('45');
    });
  });

  describe('remove', () => {
    it('should throw not implemented', async () => {
      expect(service.remove).toThrow(NotImplementedException);
    });
  });
});
