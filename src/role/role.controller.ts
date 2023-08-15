import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Post(':roleId/user/:userId')
  async asignRole(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    console.log(roleId, userId);
    return this.roleService.asignRole(roleId, userId);
  }
}
