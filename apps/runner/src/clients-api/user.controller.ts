import { ObjectResponse } from ':src/shared/api-types';
import { IPluginLabUserSchema, IUserService } from ':src/shared/user.service';
import { Controller, Get, Inject, NotFoundException, Req } from '@nestjs/common';

@Controller()
export class UserController {
  constructor(@Inject(IUserService) private userService: IUserService) {}

  @Get('/v1/user')
  async getUser(@Req() request: Request): Promise<ObjectResponse<IPluginLabUserSchema>> {
    const user = await this.userService.getUser(request);
    if (!user) {
      throw new NotFoundException();
    }
    return {
      status: 'success',
      data: user,
    };
  }
}
