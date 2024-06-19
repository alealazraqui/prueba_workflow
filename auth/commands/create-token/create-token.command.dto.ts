import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTokenCommand {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  expiresIn?: string;
}
