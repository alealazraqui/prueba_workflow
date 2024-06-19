import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CreateTokenCommand } from '../commands/create-token/create-token.command.dto';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const GetAzureUser = createParamDecorator((data: unknown, ctx: ExecutionContext): CreateTokenCommand => {
  const request = ctx.switchToHttp().getRequest();
  return request.user as CreateTokenCommand;
});
