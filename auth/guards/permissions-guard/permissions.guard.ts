import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsRepository } from '@permissions/repositories/permissions.repository';
import { ACTIONS_KEY } from '../../decorators/require-permissions.decorator';
import { UserDto } from '../../dtos/user.dto';
import { EPermissions } from '../../enums/permissions.enum';
import { RolesEnum } from '@roles/enums/roles-enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly permissionsRepository: PermissionsRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredActions = this.reflector.getAllAndOverride<EPermissions[]>(ACTIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredActions) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    //TODO : Revisar decorador GetUser
    const user: UserDto = request.user;
    if (!user || !user.rolId) {
      throw new UnauthorizedException('Unauthenticated or non-role user');
    }

    if (user.rolId == RolesEnum.SUPER_USUARIO) {
      return true;
    }

    const rolPermissions = await this.permissionsRepository.getPermissionByRole(user.rolId);
    const hasPermission = requiredActions.some(
      (permission) => Array.isArray(rolPermissions) && rolPermissions.includes(permission),
    );
    if (!hasPermission) {
      throw new UnauthorizedException('The user does not have permissions to access this resource');
    }
    return true;
  }
}
