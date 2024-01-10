import { CanActivate, ExecutionContext, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IConfig } from '../config/config.interface';
import { AuthGuard } from './auth.guard';
import { IUserService } from '../user.service';

@Injectable()
export class PluginLabGuard extends AuthGuard implements CanActivate {
  constructor(
    @Inject(IConfig) protected config: IConfig,
    protected readonly reflector: Reflector,
    @Inject(IUserService) private userService: IUserService,
  ) {
    super(config, reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const user = await this.userService.getUser(request);
      if (user) {
        return true;
      } else {
        return await super.canActivate(context);
      }
    } catch (error: any) {
      throw new HttpException({ status: 'error', error: { message: error.message } }, HttpStatus.UNAUTHORIZED);
    }
  }
}
