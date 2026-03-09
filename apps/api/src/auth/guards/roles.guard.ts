import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    
    // We expect user to be populated by JwtAuthGuard with current role context or a superadmin check.
    // If user is SUPERADMIN, always allow.
    if (user?.role === 'SUPERADMIN') return true;

    // Check if the user has the required role (maybe from JWT payload mapping to a specific league)
    // For simplicity, we assume the JWT payload contains a `role` array or single `role`
    return requiredRoles.includes(user?.role);
  }
}
