import { InstalledPluginConfig, RunnerConfig } from './types';

export interface IConfig {
  verifyAccess(apiKey: string): boolean;
  verifyPluginLabAccess(authorization: string): Promise<boolean>;
  getInstalledPlugins(): InstalledPluginConfig[];
  getRunnerConfig(): RunnerConfig;
}

// Used as a dependency injection token in NestJS
export const IConfig = Symbol('IConfig');
