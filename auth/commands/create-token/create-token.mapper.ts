import { User } from '@users/entities/user.entity';
import { UserDto } from '../../dtos/user.dto';

export class CreateTokenMapper {
  static createDto(user: User): UserDto {
    const dto = new UserDto();
    dto.email = user.email;
    dto.id = user.id;
    dto.rolId = user.rol.id;
    dto.rolDescription = user.rol.description;
    return dto;
  }
}
