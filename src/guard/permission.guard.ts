import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const [request] = context.getArgs();

    const requiredPermissions: string[] =
      this.reflector.getAllAndOverride('permissions', [
        context.getHandler(),
        context.getClass,
      ]) || [];

    const userPermissions: string[] = request?.user?.permissions || [];

    if (requiredPermissions.length) {
      const hasAlRequiredPermissions = requiredPermissions.every((permission) =>
        userPermissions.includes(permission),
      );

      if (!hasAlRequiredPermissions) throw new UnauthorizedException();
    }

    return true;
  }
}
