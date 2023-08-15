import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CurrentUserResponseDto } from './dto';

interface signinParams {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signin({ email, password }: signinParams) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new ForbiddenException('Credentials incorrect');

    if (user?.password !== password) {
      throw new UnauthorizedException();
    }

    const token = await this.signToken(user.id, user.name);

    return {
      access_token: token,
    };
  }

  async getCurrentUser(id: number): Promise<CurrentUserResponseDto> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      include: {
        roles: {
          select: {
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const tmp = user.roles?.map((role) => role.role?.name);
    delete user.roles;
    user.roles = tmp;
    console.log(tmp);
    return new CurrentUserResponseDto(user);
  }

  signToken(userId: number, username: string): Promise<string> {
    const payload = { id: userId, name: username };
    return this.jwtService.signAsync(payload);
  }
}
