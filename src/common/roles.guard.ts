import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No role restriction
    }

    interface RequestWithUser extends Request {
      user: { role: string };
    }
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    console.log('User:', user);
    console.log('User Roles:', user.role);
    console.log('Required Roles:', requiredRoles);
    if (requiredRoles.includes(user.role)) {
      return true;
    }

    throw new ForbiddenException('You are not allowed to use this endpoint');
  }
}
