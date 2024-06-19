import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDto } from '../dtos/user.dto';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const GetJWTUser = createParamDecorator((data: unknown, ctx: ExecutionContext): UserDto => {
  const request = ctx.switchToHttp().getRequest();
  return request.user as UserDto;
});
