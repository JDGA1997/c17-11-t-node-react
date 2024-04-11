import { AuthService } from '@Auth/auth.service';
import { ResponseGoogleStrategy } from '@Auth/interfaces/auth.interface';
import { PRINCIPAL_PATHS } from '@Constants/routes';
import { Public } from '@Decorators/public-access.decorator';
import { GoogleAuthGuard } from '@Guards/google-auth/google-auth.guard';
import { LocalAuthGuard } from '@Guards/local-auth/local-auth.guard';
import { RoleService } from '@Role/role.service';
import { UserService } from '@User/user.service';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

@Controller({
  version: '1',
  path: PRINCIPAL_PATHS.AUTH,
})
export class LoginController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private roleService: RoleService,
  ) {}
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request) {
    try {
      const token = await this.authService.login(
        req.user['data']._doc._id,
        req.user['data']._doc.role._id,
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = req.user['data']._doc;
      return {
        success: true,
        data: {
          access_token: token,
          user: result,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: String(error),
      });
    }
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async loginWithGoogle() {
    return {
      success: true,
    };
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleAuthRedirect(@Req() req: Request) {
    const userInfo = req.user as ResponseGoogleStrategy;

    try {
      const user = await this.userService.findUserByUsernameOrEmail(
        userInfo.email,
      );

      if (user == null) {
        const rol = await this.roleService.findOneByName('client');
        const createdUser = await this.userService.create({
          email: userInfo.email,
          first_name: userInfo.first_name,
          last_name: userInfo.last_name,
          username:
            userInfo.first_name.trim().replace(/\s+/g, '') +
            new Date().valueOf().toString(),
          email_verified: userInfo.email_verified,
          picture: userInfo.picture,
          role: rol._id.toString(),
          blocking: false,
        });

        const token = await this.authService.login(
          createdUser._id.toString(),
          rol._id.toString(),
        );

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = createdUser;
        return {
          success: true,
          data: {
            access_token: token,
            user: result,
          },
        };
      }

      const token = await this.authService.login(
        user._id.toString(),
        user.role['_id'],
      );

      return {
        success: true,
        data: {
          access_token: token,
          user: user,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: String(error),
      });
    }
  }
}