import { ExecutionContext, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyGuard } from './api-key.guard';
import { ConfigService } from '@nestjs/config';
import { SecretsService } from '@src/modules/secret-manager/secret-manager.service';

describe('ApiKeyGuard', () => {
  let guard: ApiKeyGuard;
  let secretService: SecretsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiKeyGuard,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        {
          provide: SecretsService,
          useValue: {
            refreshLambdaKey: jest.fn().mockResolvedValue(undefined),
            isKeyValid: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<ApiKeyGuard>(ApiKeyGuard);
    module.get<ConfigService>(ConfigService);
    secretService = module.get<SecretsService>(SecretsService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpiar los mocks después de cada prueba
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true when a valid API key is provided', async () => {
    (secretService.isKeyValid as jest.Mock).mockReturnValue(true);

    const mockContext: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer valid_encrypted_api_key',
          },
        }),
      }),
    } as ExecutionContext;

    await expect(guard.canActivate(mockContext)).resolves.toBe(true);
  });

  it('should throw an error when API key is not provided', async () => {
    const mockContext: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    } as ExecutionContext;

    await expect(guard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw an error when lambda key is provided wrong and refresh fails', async () => {
    (secretService.isKeyValid as jest.Mock).mockReturnValue(false);

    const mockContext: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer invalid_encrypted_api_key',
          },
        }),
      }),
    } as ExecutionContext;
    await expect(guard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
    expect(secretService.isKeyValid).toHaveBeenCalledTimes(2);
    expect(secretService.refreshLambdaKey).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when refreshLambdaKey fails', async () => {
    (secretService.isKeyValid as jest.Mock).mockReturnValueOnce(false);
    (secretService.refreshLambdaKey as jest.Mock).mockRejectedValue(
      new InternalServerErrorException('Failed to refresh lambda key'),
    );

    const mockContext: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer invalid_encrypted_api_key',
          },
        }),
      }),
    } as ExecutionContext;

    await expect(guard.canActivate(mockContext)).rejects.toThrow(InternalServerErrorException);
  });

  it('should return true when API key is invalid initially but correct after refresh', async () => {
    (secretService.isKeyValid as jest.Mock).mockReturnValueOnce(false).mockReturnValueOnce(true);
    (secretService.refreshLambdaKey as jest.Mock).mockResolvedValue(undefined);
    const mockContext: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer new_valid_encrypted_api_key',
          },
        }),
      }),
    } as ExecutionContext;
    const canActivateResponse = await guard.canActivate(mockContext);
    expect(secretService.isKeyValid).toHaveBeenCalledTimes(2);
    expect(secretService.refreshLambdaKey).toHaveBeenCalledTimes(1);
    expect(canActivateResponse).toEqual(true);
  });
});
