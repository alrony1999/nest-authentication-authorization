import { Body, Controller, Get, Post } from '@nestjs/common';
import { GetCurrentUser, Permissions, PublicRoute, Roles } from 'src/decorator';
import { AuthService } from './auth.service';
import { CurrentUserResponseDto, SigninDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicRoute()
  @Post('signin')
  signin(@Body() body: SigninDto) {
    return this.authService.signin(body);
  }

  @Roles('admin')
  @Permissions('a')
  @Get('/me')
  getMe(@GetCurrentUser('id') id: number): Promise<CurrentUserResponseDto> {
    return this.authService.getCurrentUser(id);
  }
}
