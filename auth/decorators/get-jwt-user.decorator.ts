import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDto } from '../dtos/user.dto';

export const GetJWTUser = createParamDecorator((data: unknown, ctx: ExecutionContext): UserDto => {
  const request = ctx.switchToHttp().getRequest();
  return request.user as UserDto;
});
