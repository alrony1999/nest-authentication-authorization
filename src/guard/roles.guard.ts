import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const [request] = context.getArgs();

    const requiredRoles: string[] =
      this.reflector.getAllAndOverride('roles', [
        context.getHandler(),
        context.getClass,
      ]) || [];

    const userRoles: string[] = request?.user?.roles || [];

    if (requiredRoles.length) {
      const hasAlRequiredRoles = requiredRoles.every((roles) =>
        userRoles.includes(roles),
      );

      if (!hasAlRequiredRoles) throw new UnauthorizedException();
    }

    return true;
  }
}
