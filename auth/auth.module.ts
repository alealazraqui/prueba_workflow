import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { CreateTokenCommandHandler } from './commands/create-token/create-token.handler';
import { AuthController } from './controllers/auth.controller';
import { ApiKeyGuard } from './guards/api-key-guard/api-key.guard';
import { JwtGuard } from './guards/jwt-guard/jwt.guard';
import { AzureADStrategy } from './strategies/azuread.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PermissionsModule } from '../permissions/permissions.module';
import { JWTPermissionsGuard } from './guards/jwt-permissions-guard/jwt-permissions.guard';


@Global()
@Module({
  imports: [PassportModule, ConfigModule, PermissionsModule],
  providers: [
    AzureADStrategy,
    CreateTokenCommandHandler,
    ApiKeyGuard,
    JwtStrategy,
    JwtGuard,
    PermissionsGuard,
    JWTPermissionsGuard,
  ],
  controllers: [AuthController],
  exports: [PassportModule, PermissionsModule, PermissionsGuard, JWTPermissionsGuard, JwtGuard, ApiKeyGuard],
})
export class AuthModule {}
