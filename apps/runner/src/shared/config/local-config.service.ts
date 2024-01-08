import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ApiKeyConfig, InstalledPluginConfig, RunnerConfig, PluginLabAppConfig } from './types';
import { IConfig } from './config.interface';
import { PluginLabApp } from '@pluginlab/node-sdk';

@Injectable()
export class LocalConfigService implements IConfig {
  constructor(private configService: ConfigService) {}

  verifyAccess(apiKey: string): boolean {
    let isAccessAllowed = false;

    if (!apiKey) throw new UnauthorizedException('API key is not provided');

    const apiKeys = this.configService.get<ApiKeyConfig[]>('apiKeys');
    if (apiKeys) {
      apiKeys.forEach((item) => {
        if (item.apiKey === apiKey) {
          isAccessAllowed = true;
          return;
        }
      });
    }

    if (!isAccessAllowed) throw new UnauthorizedException('API key is not valid');

    return isAccessAllowed;
  }

  async verifyPluginLabAccess(authorization: string): Promise<boolean> {
    if (!authorization) throw new UnauthorizedException('Authorization header is not provided');

    const pluginLabAppConfig = this.configService.get<PluginLabAppConfig>('pluginLabAppConfig');
    if (!pluginLabAppConfig) throw new UnauthorizedException('PluginLab configuration is not defined');

    const pluginLabApp = new PluginLabApp(pluginLabAppConfig);
    try {
      await pluginLabApp.getAuth().verifyIdToken(authorization);
      return true;
    } catch {
      throw new UnauthorizedException('PluginLab Authorization header is not valid');
    }
  }

  getInstalledPlugins(): InstalledPluginConfig[] {
    const installedPlugins = this.configService.get<InstalledPluginConfig[]>('installedPlugins');
    return installedPlugins ?? [];
  }

  getRunnerConfig(): RunnerConfig {
    const runnerConfig = this.configService.get<RunnerConfig>('runnerConfig');

    if (!runnerConfig) {
      throw new Error('RunnerConfig is not defined in the configuration');
    }

    return runnerConfig;
  }
}
