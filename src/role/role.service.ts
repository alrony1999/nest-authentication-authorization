import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    const role = await this.prismaService.role.create({
      data: {
        name: createRoleDto.name,
      },
    });

    return role;
  }

  async asignRole(roleId: number, userId: number) {
    const role = await this.prismaService.role.findFirst({
      where: {
        id: roleId,
      },
    });

    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: {
        roles: {
          create: {
            role: {
              connect: {
                id: roleId,
              },
            },
          },
        },
      },
    });

    // const abc = await this.prismaService.usersOnRoles.create({
    //   data: {
    //     user: {
    //       connect: {
    //         id: userId,
    //       },
    //     },
    //     role: {
    //       connect: {
    //         id: roleId,
    //       },
    //     },
    //   },
    // });
  }
}
