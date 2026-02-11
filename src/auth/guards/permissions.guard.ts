import {
  CanActivate, ExecutionContext, Injectable, Logger, ForbiddenException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/roles.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required || required.length === 0) {
      this.logger.debug('No permissions required for this route');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    this.logger.debug(`Checking permissions for route: ${request.method} ${request.url}`);
    this.logger.debug(`Required permissions: ${JSON.stringify(required)}`);

    if (!user) {
      this.logger.warn('No user found in request');
      throw new ForbiddenException({
        message: 'User not authenticated',
        error: 'Forbidden',
        statusCode: 403,
        details: 'No user found in request', // Consider removing this too if strict

      });
    }

    const userPermissionCodes: string[] = user?.permissions ||
      user?.role?.permissions?.map((rp) => rp.permission.permissionCode) || [];

    this.logger.debug(`User permissions: ${JSON.stringify(userPermissionCodes)}`);
    this.logger.debug(`User role: ${user?.role?.name || 'N/A'}`);
    this.logger.debug(`User ID: ${user?.userId || user?.id || 'N/A'}`);

    const hasPermission = required.every((permission) => userPermissionCodes.includes(permission));

    if (!hasPermission) {
      const missingPermissions = required.filter(p => !userPermissionCodes.includes(p));
      this.logger.warn(`Permission denied. Missing permissions: ${JSON.stringify(missingPermissions)}`);
      throw new ForbiddenException({
        message: 'Forbidden resource',
        error: 'Forbidden',
        statusCode: 403,
        details: {
          message: 'You do not have the required permissions to access this resource',
        },
      });
    }

    this.logger.debug('Permission check passed');
    return hasPermission;
  }
}
