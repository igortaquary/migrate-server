import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/user.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    findOne: jest.fn().mockImplementation((id: string) => {
      return { id, name: 'User 1' };
    }),
    update: jest.fn().mockImplementation((id: string, dto: UpdateUserDto) => {
      return { id, ...dto };
    }),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findProfile', () => {
    it('should return the user profile', async () => {
      const id = '1';
      expect(
        await controller.findProfile({
          sub: id,
          id,
          email: 'email',
          name: 'name',
        }),
      ).toEqual({
        id: '1',
        name: 'User 1',
      });
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('findOne', () => {
    it('should call userService.findOne', async () => {
      const id = '39984';
      expect(await controller.findOne(id)).toEqual({ id, name: 'User 1' });
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  const jwtData = {
    sub: '123',
    id: '123',
    email: 'email',
    name: 'name',
  };

  describe('update', () => {
    it('should call userService.update', async () => {
      const updateUserDto = { name: 'Nome atualizado' };
      expect(await controller.update(jwtData, updateUserDto)).toEqual({
        id: jwtData.id,
        ...updateUserDto,
      });
      expect(service.update).toHaveBeenCalledWith(jwtData.id, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should call userService.remove', async () => {
      expect(controller.remove(jwtData)).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(jwtData.id);
    });
  });
});
