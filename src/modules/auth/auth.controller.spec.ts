import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
            signUp: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signIn', () => {
    it('should return an access token if credentials are valid', async () => {
      const result = { access_token: 'some_token' };
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'password',
      };

      jest.spyOn(authService, 'signIn').mockResolvedValue(result);

      expect(await authController.signIn(signInDto)).toBe(result);
      expect(authService.signIn).toHaveBeenCalledWith(
        signInDto.email,
        signInDto.password,
      );
    });
  });

  describe('signUp', () => {
    const signUpDto: SignUpDto = {
      email: 'test@example.com',
      password: 'password',
      name: 'Test User',
      phone: '99999999999',
    };
    it('should create a new user if email is not taken', async () => {
      const result = { id: '1', email: 'test@example.com', name: 'Test User' };

      jest.spyOn(authService, 'signUp').mockResolvedValue(result.id);

      expect(await authController.signUp(signUpDto)).toBe(result.id);
      expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
    });

    it('should throw an error if signUp fails', async () => {
      jest
        .spyOn(authService, 'signUp')
        .mockRejectedValue(new Error('Error occurred'));

      await expect(authController.signUp(signUpDto)).rejects.toThrow(
        new Error('Error occurred'),
      );
      expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
    });
  });
});
