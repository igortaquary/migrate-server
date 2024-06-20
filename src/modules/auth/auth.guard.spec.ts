import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let jwtService: JwtService;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
    reflector = module.get<Reflector>(Reflector);
  });

  const mockExecutionContext: Partial<
    Record<
      jest.FunctionPropertyNames<ExecutionContext>,
      jest.MockedFunction<any>
    >
  > = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        headers: { authorization: 'Bearer token' },
      }),
      getResponse: jest.fn(),
    }),
    getHandler: jest.fn().mockReturnValue(jest.fn()),
    getClass: jest.fn(),
  };

  it('should allow access if the route is public', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

    await expect(
      authGuard.canActivate(mockExecutionContext as any),
    ).resolves.toBe(true);
  });

  it('should throw UnauthorizedException if no token is provided', async () => {
    const mockExecutionContextNoToken: Partial<
      Record<
        jest.FunctionPropertyNames<ExecutionContext>,
        jest.MockedFunction<any>
      >
    > = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {},
        }),
        getResponse: jest.fn(),
      }),
      getHandler: jest.fn().mockReturnValue(jest.fn()),
      getClass: jest.fn(),
    };

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

    await expect(
      authGuard.canActivate(mockExecutionContextNoToken as ExecutionContext),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    jest
      .spyOn(jwtService, 'verifyAsync')
      .mockRejectedValue(new Error('Invalid token'));

    await expect(
      authGuard.canActivate(mockExecutionContext as any),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should allow access if token is valid', async () => {
    const user = { id: 1, email: 'test@example.com' };

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(user);

    await expect(
      authGuard.canActivate(mockExecutionContext as any),
    ).resolves.toBe(true);

    const request = mockExecutionContext.switchToHttp().getRequest();
    expect(request.user).toBe(user);
  });
});
