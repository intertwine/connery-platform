import { Module } from '@nestjs/common';
import { SharedModule } from ':src/shared/shared.module';
import { ActionsController } from './actions.controller';
import { PluginsController } from './plugins.controller';
import { ToolsController } from './tools.controller';
import { UserController } from './user.controller';

@Module({
  imports: [SharedModule],
  controllers: [ActionsController, PluginsController, ToolsController, UserController],
})
export class ClientsApiModule {}
