import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ADMIN_ONLY_KEY } from '../decorators/admin-only.decorator';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isAdminOnly = this.reflector.getAllAndOverride<boolean>(
      ADMIN_ONLY_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!isAdminOnly) {
      return true; // If not marked as admin-only, allow access
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    // Check if user has Admin role
    if (user.role !== 'Admin') {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
}
