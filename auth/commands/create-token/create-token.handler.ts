import { QueryBus } from '@cqrs';
import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as jwt from 'jsonwebtoken';
import { UnauthorizedException } from '@nestjs/common';
import { CreateTokenCommand } from './create-token.command.dto';
import { CreateTokenMapper } from './create-token.mapper';
import { GetUserByEmailQuery } from '@users/queries/get-user-by-email/get-user-by-email.query.dto';
import { User } from '@users/entities/user.entity';

@CommandHandler(CreateTokenCommand)
export class CreateTokenCommandHandler implements ICommandHandler<CreateTokenCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly configService: ConfigService,
  ) {}

  async execute(command: CreateTokenCommand): Promise<string> {
    const userQuery = new GetUserByEmailQuery();
    const iss = this.configService.get<string>('JWT_ISSUER') as string;
    const secret = this.configService.get<string>('JWT_SECRET') as string;
    userQuery.email = command.email;
    const user = await this.queryBus.execute<User | null>(userQuery);
    if (!user) {
      throw new UnauthorizedException();
    }
    const userDto = CreateTokenMapper.createDto(user);
    return jwt.sign(
      {
        user: userDto,
        iss,
      },
      secret,
      {
        expiresIn: command.expiresIn,
      },
    );
  }
}
