import { CommandBus, CqrsController, QueryBus } from '@cqrs';
import { Controller, Get, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { GetAzureUser } from '../decorators/get-azure-user.decorator';
import { CreateTokenCommand } from '../commands/create-token/create-token.command.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController extends CqrsController {
  constructor(
    readonly queryBus: QueryBus,
    readonly commandBus: CommandBus,
    readonly configService: ConfigService,
  ) {
    super(queryBus, commandBus);
  }

  @Get('/login')
  @UseGuards(AuthGuard('azure'))
  async initiateLogin(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  }

  @Get('/callback')
  @UseGuards(AuthGuard('azure'))
  @UsePipes(new ValidationPipe({ transform: true }))
  async callback(@GetAzureUser() req: CreateTokenCommand, @Res() res: Response): Promise<void> {
    const command = new CreateTokenCommand();
    command.email = req.email;
    command.expiresIn = req.expiresIn;
    const accessToken = await this.commandBus.execute(command);
    res.redirect(`${this.configService.get<string>('FE_REDIRECT_URI')}?accessToken=${accessToken}`);
  }
}
