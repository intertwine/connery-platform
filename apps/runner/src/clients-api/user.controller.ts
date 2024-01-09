import { ObjectResponse } from ':src/shared/api-types';
import { IUserSchema, IUserService } from ':src/shared/user.service';
import { Controller, Get, Inject, Req } from '@nestjs/common';

@Controller()
export class UserController {
  constructor(@Inject(IUserService) private userService: IUserService) {}

  @Get('/v1/user')
  async getUser(@Req() request: Request): Promise<ObjectResponse<IUserSchema>> {
    const user = this.userService.getUser(request);

    console.log('User request %o', user);

    return {
      status: 'success',
      data: user,
    };
  }
}
