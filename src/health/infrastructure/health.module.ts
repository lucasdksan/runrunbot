import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { DiscordModule } from '../../shared/infrastructure/discord/discord.module';
import { EnvConfigModule } from '../../shared/infrastructure/env-config/env-config.module';
import { SqliteService } from '../../shared/infrastructure/database/sqlite/database.service';

@Module({
  imports: [EnvConfigModule, DiscordModule],
  providers: [
    {
      provide: 'SqliteService',
      useClass: SqliteService,
    },
  ],
  controllers: [HealthController],
})
export class HealthModule {}
