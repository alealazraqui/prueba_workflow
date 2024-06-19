import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtGuard } from '../jwt-guard/jwt.guard';
import { PermissionsGuard } from '../permissions-guard/permissions.guard';

@Injectable()
export class JWTPermissionsGuard implements CanActivate {
  constructor(
    private jwtGuard: JwtGuard,
    private permissionsGuard: PermissionsGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return (await this.jwtGuard.canActivate(context)) && (await this.permissionsGuard.canActivate(context));
  }
}
