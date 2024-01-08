import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { IConfig } from './config/config.interface';
import { LocalConfigService } from './config/local-config.service';
import { PluginLabGuard } from './guards/pluginlab.guard';
import { ILlm } from './llm/llm.interface';
import { IOpenAI } from './llm/openai.interface';
import { OpenAiService } from './llm/openai.service';
import { OpenApiService } from './openapi.service';
import { MemoryCacheService } from './plugin-cache/memory-cache.service';
import { IPluginCache } from './plugin-cache/plugin-cache.interface';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PluginLabGuard,
    },
    {
      provide: IConfig,
      useClass: LocalConfigService,
    },
    {
      provide: IPluginCache,
      useClass: MemoryCacheService,
    },
    {
      provide: ILlm,
      useClass: OpenAiService,
    },
    {
      provide: IOpenAI,
      useClass: OpenAiService,
    },
    OpenApiService,
  ],
  exports: [IConfig, IPluginCache, ILlm, IOpenAI, OpenApiService],
})
export class SharedModule {}
