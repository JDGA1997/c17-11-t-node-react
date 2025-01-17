import { CareService } from '@Care/care.service';
import { PRINCIPAL_PATHS } from '@Constants/routes';
import { Roles } from '@Decorators/role.decorator';
// import { Public } from '@Decorators/public-access.decorator';
import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';

@Controller({
  version: '1',
  path: PRINCIPAL_PATHS.CARE,
})
export class GettersController {
  constructor(private careService: CareService) {}

  // @Public()
  @Roles('admin')
  @Get()
  async getAll() {
    try {
      const cares = await this.careService.findAll();

      return {
        success: true,
        data: cares,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: String(error),
      });
    }
  }

  @Roles('caretaker')
  @Get('pending')
  async getAllPending() {
    try {
      const cares = await this.careService.findAllPending();

      return {
        success: true,
        data: cares,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: String(error),
      });
    }
  }

  // @Public()
  @Roles('admin')
  @Get('p')
  async getAllPaginate(@Query('page') p: string, @Query('limit') l: string) {
    const page = p == undefined ? 1 : Number(p);
    const limit = l == undefined ? 10 : Number(l);

    try {
      const cares = await this.careService.findAllPaginate(page, limit);

      return {
        success: true,
        data: cares,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: String(error),
      });
    }
  }

  // @Public()

  @Roles('caretaker', 'admin')
  @Get(':id')
  async getById(@Param('id') id: string) {
    try {
      const care = await this.careService.findById(id);
      if (care == null) throw new Error('null');

      return {
        success: true,
        data: care,
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message == 'null') {
          throw new NotFoundException({
            success: false,
            message: 'Care not found',
          });
        }
      }

      throw new InternalServerErrorException({
        success: false,
        message: String(error),
      });
    }
  }

  // @Public()
  @Roles('caretaker')
  @Get('caretaker/:caretakerId')
  async findByCaretaker(@Param('caretakerId') caretakerId: string) {
    try {
      const care = await this.careService.findByCaretaker(caretakerId);
      if (care == null) throw new Error('null');

      return {
        success: true,
        data: care,
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message == 'null') {
          throw new NotFoundException({
            success: false,
            message: 'Not found',
          });
        }
      }

      throw new InternalServerErrorException({
        success: false,
        message: String(error),
      });
    }
  }
}
