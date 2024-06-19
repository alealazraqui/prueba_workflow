import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { SecretsService } from '@src/modules/secret-manager/secret-manager.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly secretService: SecretsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const lambdaKey = this.getLambdaKeyFromRequest(context);
    if (!lambdaKey) {
      throw new UnauthorizedException('API key not found');
    }
    if (!this.secretService.isKeyValid(lambdaKey)) {
      await this.secretService.refreshLambdaKey();
      if (!this.secretService.isKeyValid(lambdaKey)) {
        throw new UnauthorizedException('Invalid API key');
      }
    }
    return true;
  }

  private getLambdaKeyFromRequest(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    return authHeader && authHeader.split(' ')[1];
  }
}
