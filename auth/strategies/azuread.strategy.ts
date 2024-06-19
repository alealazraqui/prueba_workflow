import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import { ConfigService } from '@nestjs/config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { CreateTokenCommand } from '../commands/create-token/create-token.command.dto';

@Injectable()
export class AzureADStrategy extends PassportStrategy(OAuth2Strategy, 'azure') {
  constructor(configService: ConfigService) {
    super({
      authorizationURL: `https://login.microsoftonline.com/${configService.get<string>('AZURE_TENANT_ID')}/oauth2/v2.0/authorize`,
      tokenURL: `https://login.microsoftonline.com/${configService.get<string>('AZURE_TENANT_ID')}/oauth2/v2.0/token`,
      clientID: configService.get<string>('AZURE_CLIENT_ID'),
      clientSecret: configService.get<string>('AZURE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('AZURE_CALLBACK_URI'),
      scope: ['openid', 'profile', 'email'],
    });
  }

  async validate(accessToken: string): Promise<CreateTokenCommand> {
    const decoded = jwt.decode(accessToken) as JwtPayload;
    let user = new CreateTokenCommand();
    if (decoded) {
      user = {
        email: decoded.unique_name,
        expiresIn: decoded.exp?.toString(),
      };
    }

    return user;
  }
}
