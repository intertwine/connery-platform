import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PluginLabApp, PluginLabAppConfig } from '@pluginlab/node-sdk';

export interface IPluginLabUserSchema {
  id: string;
  email?: string;
  name?: string;
  givenName?: string;
  planId?: string;
  priceId?: string;
}

export interface IPluginLabVerifySchema {
  uid: string;
  aud: string;
  iss: string;
  iat: string;
  exp: string;
  user: IPluginLabUserSchema;
}

export interface IUserService {
  getUser(request: Request): Promise<IPluginLabUserSchema | undefined>;
}

export const IUserService = Symbol('IUserService');

@Injectable()
export class UserService implements IUserService {
  private pluginLabApp: any;
  private pluginLabAuth: any;

  constructor(private configService: ConfigService) {
    const pluginLabAppConfig = this.configService.get<PluginLabAppConfig>('pluginLabAppConfig');
    if (!pluginLabAppConfig) throw new InternalServerErrorException('PluginLab configuration is not defined');
    this.pluginLabApp = new PluginLabApp(pluginLabAppConfig);
    this.pluginLabAuth = this.pluginLabApp.getAuth();
  }

  getJWTFromRequest(request: any) {
    let jwt;
    const pluginLabEventId = request.headers['x-pluginlab-event-id'];
    const pluginLabAuthorization = request.headers['authorization'];
    if (pluginLabEventId && pluginLabAuthorization) {
      jwt = pluginLabAuthorization.replace(/^Bearer\s/, '');
    }
    return jwt;
  }

  async getUser(request: any): Promise<IPluginLabUserSchema | undefined> {
    let user;
    try {
      const authJwt = this.getJWTFromRequest(request);
      const verify = (await this.pluginLabAuth.verifyIdToken(authJwt)) as IPluginLabVerifySchema;
      return verify.user;
    } catch {
      return user;
    }
  }
}
