import { PRINCIPAL_PATHS } from '@Constants/routes';
import { UpdateUserDTO } from '@User/dto/user.dto';
import { UserService } from '@User/user.service';
import {
  Body,
  Controller,
  InternalServerErrorException,
  Patch,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

@Controller({
  version: '1',
  path: PRINCIPAL_PATHS.USER,
})
export class UpdateController {
  constructor(private userService: UserService) {}

  @Patch()
  async updateUser(@Body() data: UpdateUserDTO, @Req() req: Request) {
    try {
      const user = await this.userService.update(req.user['userId'], data);
      user.password = '';
      console.log(user);

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: String(error),
      });
    }
  }
}
