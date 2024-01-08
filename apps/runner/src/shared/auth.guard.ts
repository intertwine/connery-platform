import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IConfig } from './config/config.interface';

// This is a custom decorator that we will use to mark routes as public
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(IConfig) private config: IConfig, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const apiKey = request.headers['x-api-key'];
    const pluginLabEventId = request.headers['x-pluginlab-event-id'];
    const pluginLabAuthorization = request.headers['Authorization'];

    try {
      if (pluginLabEventId) {
        return await this.config.verifyPluginLabAccess(pluginLabAuthorization);
      } else {
        return this.config.verifyAccess(apiKey);
      }
    } catch (error: any) {
      throw new HttpException({ status: 'error', error: { message: error.message } }, HttpStatus.UNAUTHORIZED);
    }
  }
}
