import { Inject, Injectable } from '@nestjs/common';
import { IConfig } from './config/config.interface';

export interface IUserSchema {
  name: string;
  email: string;
}

export interface IUserService {
  getUser(): IUserSchema;
}

export const IUserService = Symbol('IUserService');

@Injectable()
export class UserService implements IUserService {
  constructor(@Inject(IConfig) private readonly config: IConfig) {}

  getUser(): IUserSchema {
    return {
      name: 'Test User',
      email: 'test@example.com',
    };
  }
}
