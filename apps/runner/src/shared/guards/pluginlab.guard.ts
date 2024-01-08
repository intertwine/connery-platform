import { CanActivate, ExecutionContext, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IConfig } from '../config/config.interface';
import { AuthGuard } from './auth.guard';

@Injectable()
export class PluginLabGuard extends AuthGuard implements CanActivate {
  constructor(@Inject(IConfig) protected config: IConfig, protected readonly reflector: Reflector) {
    super(config, reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const pluginLabEventId = request.headers['x-pluginlab-event-id'];
    const pluginLabAuthorization = request.headers['authorization'];

    try {
      if (pluginLabEventId) {
        return await this.config.verifyPluginLabAccess(pluginLabAuthorization);
      } else {
        return await super.canActivate(context);
      }
    } catch (error: any) {
      throw new HttpException({ status: 'error', error: { message: error.message } }, HttpStatus.UNAUTHORIZED);
    }
  }
}
