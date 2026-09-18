import { ForbiddenException } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { UserRole } from '../../user/entities/user-role.enum';
import { assertOwnerOrAdmin } from './resource-access';

describe('assertOwnerOrAdmin', () => {
  it('allows the resource owner', () => {
    const user = { id: 1, role: UserRole.USER } as User;

    expect(() => assertOwnerOrAdmin(user, 1)).not.toThrow();
  });

  it('allows an administrator', () => {
    const user = { id: 1, role: UserRole.ADMIN } as User;

    expect(() => assertOwnerOrAdmin(user, 2)).not.toThrow();
  });

  it('forbids another user', () => {
    const user = { id: 1, role: UserRole.USER } as User;

    expect(() => assertOwnerOrAdmin(user, 2)).toThrow(ForbiddenException);
  });
});
