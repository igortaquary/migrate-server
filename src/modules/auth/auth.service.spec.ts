import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/sign-up.dto';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOneByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signIn', () => {
    it('should return access token if credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const user = {
        id: '123',
        email,
        password: 'hashedPassword',
        name: 'Test User',
      };
      const token = 'access_token';

      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(token);

      const result = await authService.signIn(email, password);

      expect(result).toEqual({ access_token: token });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(null);

      await expect(
        authService.signIn('test@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const user = {
        id: '1231',
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
      };

      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.signIn('test@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signUp', () => {
    const payload: SignUpDto = {
      email: 'test@example.com',
      password: 'password',
      name: 'Test User',
      phone: '99999999999',
    };
    it('should create a new user if email is not taken', async () => {
      const user = {
        id: '1',
        ...payload,
        password: 'hashedPassword',
        salt: 'salt',
      };

      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(null);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      jest.spyOn(userService, 'create').mockResolvedValue(user.id);

      const result = await authService.signUp(payload);

      expect(result).toEqual(user.id);
    });

    it('should throw ConflictException if email is already taken', async () => {
      const foundUser = {
        id: '123',
        ...payload,
        password: 'hashedPassword',
        salt: 'salt',
      };

      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(foundUser);

      await expect(authService.signUp(payload)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
