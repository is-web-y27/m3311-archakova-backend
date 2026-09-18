import { registerEnumType } from '@nestjs/graphql';
import { UserRole } from '../entities/user-role.enum';

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'Роль пользователя в системе',
});

export { UserRole };