import { ForbiddenException } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { UserRole } from '../../user/entities/user-role.enum';

export function assertOwnerOrAdmin(user: User, ownerId: number): void {
  if (user.role === UserRole.ADMIN || user.id === ownerId) {
    return;
  }

  throw new ForbiddenException('You can manage only your own resources');
}
